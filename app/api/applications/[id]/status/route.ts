import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse } from '@/lib/api-response';
import { ApplicationStatus } from '@prisma/client';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: applicationId } = params;
    const session = getTokenFromRequest(req);
    if (!session || (session.role !== 'RECRUITER' && session.role !== 'ADMIN')) {
      return unauthorizedResponse('Only recruiters and administrators can update application statuses');
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            company: true,
          },
        },
        candidateProfile: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!application) {
      return notFoundResponse('Application not found');
    }

    if (session.role === 'RECRUITER' && application.job.companyId !== session.companyId) {
      return forbiddenResponse('You can only manage applications for your organization');
    }

    const body = await req.json();
    const { status, notes, interviewDate, interviewType, interviewLink } = body;

    if (!status || !Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      return errorResponse('Valid application status is required', 400);
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: status as ApplicationStatus,
        statusUpdatedAt: new Date(),
        ...(notes !== undefined && { notes }),
      },
      include: {
        job: {
          include: { company: true },
        },
        candidateProfile: {
          include: { user: true },
        },
        resume: true,
        interviews: true,
      },
    });

    // If status is INTERVIEW and date provided, create interview entry
    if (status === ApplicationStatus.INTERVIEW && interviewDate) {
      await prisma.interview.create({
        data: {
          applicationId,
          scheduledAt: new Date(interviewDate),
          locationOrLink: interviewLink?.trim() || 'Online Meeting link will be shared via email',
          interviewType: interviewType?.trim() || 'Technical & Cultural Interview',
          status: 'SCHEDULED',
          notes: notes || null,
        },
      });
    }

    // Send candidate targeted notification
    const candidateUserId = application.candidateProfile.user.id;
    let notifTitle = 'Application Status Updated';
    let notifMsg = `Your application for "${application.job.title}" at ${application.job.company.name} is now ${status.replace('_', ' ')}.`;
    let notifType = 'STATUS_CHANGE';

    if (status === ApplicationStatus.SHORTLISTED) {
      notifTitle = 'Great News: Application Shortlisted!';
      notifMsg = `You have been shortlisted for "${application.job.title}" at ${application.job.company.name}. The hiring team will be in touch soon.`;
      notifType = 'SHORTLISTED';
    } else if (status === ApplicationStatus.INTERVIEW) {
      notifTitle = 'Interview Invitation Scheduled';
      notifMsg = `${application.job.company.name} invited you to an interview for "${application.job.title}". Check your application details for schedule.`;
      notifType = 'INTERVIEW';
    } else if (status === ApplicationStatus.SELECTED) {
      notifTitle = 'Congratulations! You Have Been Selected!';
      notifMsg = `Exciting news! ${application.job.company.name} selected your application for "${application.job.title}".`;
      notifType = 'SELECTION';
    } else if (status === ApplicationStatus.REJECTED) {
      notifTitle = 'Application Status Update';
      notifMsg = `Thank you for your interest in "${application.job.title}". The company has decided to proceed with other candidates at this time.`;
      notifType = 'STATUS_CHANGE';
    }

    await prisma.notification.create({
      data: {
        userId: candidateUserId,
        title: notifTitle,
        message: notifMsg,
        type: notifType,
        link: '/candidate/applications',
      },
    });

    return successResponse(updatedApplication, `Application status updated to ${status}`);
  } catch (error: any) {
    console.error('Update application status error:', error);
    return errorResponse('Failed to update application status', 500, error.message);
  }
}
