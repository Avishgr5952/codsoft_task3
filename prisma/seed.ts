import { PrismaClient, Role, UserStatus, JobType, WorkMode, ExperienceLevel, JobStatus, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'CareerHub@123';

async function main() {
  console.log('Seeding CareerHub database with comprehensive, rich demo data...');

  // Clean existing records in proper relational order
  await prisma.notification.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.job.deleteMany();
  await prisma.jobCategory.deleteMany();
  await prisma.candidateSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.candidateProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ==========================================
  // 1. CORE ADMIN & RECRUITER USERS
  // ==========================================
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@careerhub.com',
      password: hashedPassword,
      name: 'Eleanor Vance (Admin)',
      phone: '+1 (555) 019-2831',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const recruiterUser1 = await prisma.user.create({
    data: {
      email: 'recruiter@careerhub.com',
      password: hashedPassword,
      name: 'Sarah Jenkins',
      phone: '+1 (555) 234-5678',
      role: Role.RECRUITER,
      status: UserStatus.ACTIVE,
    },
  });

  const recruiterUser2 = await prisma.user.create({
    data: {
      email: 'recruiter2@careerhub.com',
      password: hashedPassword,
      name: 'David Miller',
      phone: '+1 (555) 345-6789',
      role: Role.RECRUITER,
      status: UserStatus.ACTIVE,
    },
  });

  const recruiterUser3 = await prisma.user.create({
    data: {
      email: 'recruiter3@careerhub.com',
      password: hashedPassword,
      name: 'Emily Chen',
      phone: '+1 (555) 456-7890',
      role: Role.RECRUITER,
      status: UserStatus.ACTIVE,
    },
  });

  const recruiterUser4 = await prisma.user.create({
    data: {
      email: 'recruiter4@careerhub.com',
      password: hashedPassword,
      name: 'Marcus Sterling',
      phone: '+1 (555) 567-8901',
      role: Role.RECRUITER,
      status: UserStatus.ACTIVE,
    },
  });

  // ==========================================
  // 2. CANDIDATE USERS (Alex Morgan + 17 Candidates)
  // ==========================================
  const candidateUser1 = await prisma.user.create({
    data: {
      email: 'candidate@careerhub.com',
      password: hashedPassword,
      name: 'Alex Morgan',
      phone: '+1 (555) 987-6543',
      role: Role.CANDIDATE,
      status: UserStatus.ACTIVE,
    },
  });

  const candidateUsersData = [
    { email: 'priya.sharma@example.com', name: 'Priya Sharma', phone: '+1 (555) 111-2233' },
    { email: 'marcus.vance@example.com', name: 'Marcus Vance', phone: '+1 (555) 222-3344' },
    { email: 'elena.rostova@example.com', name: 'Elena Rostova', phone: '+1 (555) 333-4455' },
    { email: 'liam.oconnor@example.com', name: 'Liam O Connor', phone: '+1 (555) 444-5566' },
    { email: 'sofia.rodriguez@example.com', name: 'Sofia Rodriguez', phone: '+1 (555) 555-6677' },
    { email: 'daniel.kim@example.com', name: 'Daniel Kim', phone: '+1 (555) 666-7788' },
    { email: 'chloe.bennett@example.com', name: 'Chloe Bennett', phone: '+1 (555) 777-8899' },
    { email: 'james.wilson@example.com', name: 'James Wilson', phone: '+1 (555) 888-9900' },
    { email: 'aisha.patel@example.com', name: 'Aisha Patel', phone: '+1 (555) 999-0011' },
    { email: 'lucas.silva@example.com', name: 'Lucas Silva', phone: '+1 (555) 123-4567' },
    { email: 'maya.lin@example.com', name: 'Maya Lin', phone: '+1 (555) 234-5671' },
    { email: 'ryan.reynolds@example.com', name: 'Ryan Reynolds', phone: '+1 (555) 345-6712' },
    { email: 'nina.patel@example.com', name: 'Nina Patel', phone: '+1 (555) 456-7813' },
    { email: 'oliver.king@example.com', name: 'Oliver King', phone: '+1 (555) 567-8914' },
    { email: 'zoe.zhang@example.com', name: 'Zoe Zhang', phone: '+1 (555) 678-9015' },
    { email: 'brandon.lee@example.com', name: 'Brandon Lee', phone: '+1 (555) 789-0116' },
    { email: 'samantha.reed@example.com', name: 'Samantha Reed', phone: '+1 (555) 890-1217' },
  ];

  const candidateUsers = [candidateUser1];
  for (const c of candidateUsersData) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        password: hashedPassword,
        name: c.name,
        phone: c.phone,
        role: Role.CANDIDATE,
        status: UserStatus.ACTIVE,
      },
    });
    candidateUsers.push(user);
  }

  // ==========================================
  // 3. COMPANIES (10 Realistic Tech Brands)
  // ==========================================
  const companiesData = [
    {
      name: 'TechNova Solutions',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
      website: 'https://technova.example.com',
      industry: 'Cloud Infrastructure & Enterprise AI',
      location: 'San Francisco, CA',
      companySize: '201-500 employees',
      foundedYear: 2018,
      description: 'TechNova pioneers next-generation scalable cloud platforms, distributed systems, and real-time AI inference engines for modern global enterprises.',
      linkedinUrl: 'https://linkedin.com/company/technova',
      twitterUrl: 'https://twitter.com/technova',
    },
    {
      name: 'Nexus FinTech',
      logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=160&auto=format&fit=crop&q=80',
      website: 'https://nexusfintech.example.com',
      industry: 'Financial Technology & Payments',
      location: 'New York, NY',
      companySize: '501-1000 employees',
      foundedYear: 2016,
      description: 'Nexus FinTech creates high-throughput payments orchestration APIs, automated ledger systems, and borderless banking infrastructure.',
      linkedinUrl: 'https://linkedin.com/company/nexus-fintech',
      twitterUrl: 'https://twitter.com/nexusfintech',
    },
    {
      name: 'HealthPulse AI',
      logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=160&auto=format&fit=crop&q=80',
      website: 'https://healthpulse.example.com',
      industry: 'Digital Health & Medical AI',
      location: 'Boston, MA',
      companySize: '51-200 employees',
      foundedYear: 2020,
      description: 'HealthPulse develops medical-grade diagnostic imaging models, intelligent electronic medical records integrations, and patient care workflows.',
      linkedinUrl: 'https://linkedin.com/company/healthpulse-ai',
      twitterUrl: 'https://twitter.com/healthpulse',
    },
    {
      name: 'CyberShield Labs',
      logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=160&auto=format&fit=crop&q=80',
      website: 'https://cybershield.example.com',
      industry: 'Cybersecurity & Zero Trust',
      location: 'Austin, TX',
      companySize: '101-250 employees',
      foundedYear: 2019,
      description: 'CyberShield provides automated threat hunting, zero-trust cloud network security, and compliance telemetry for global organizations.',
      linkedinUrl: 'https://linkedin.com/company/cybershield',
      twitterUrl: 'https://twitter.com/cybershieldlabs',
    },
    {
      name: 'Vertex Media & Design',
      logoUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=160&auto=format&fit=crop&q=80',
      website: 'https://vertexmedia.example.com',
      industry: 'Digital Design & Creative Tech',
      location: 'Los Angeles, CA',
      companySize: '11-50 employees',
      foundedYear: 2021,
      description: 'Vertex is an award-winning digital experience studio blending spatial 3D graphics, brand storytelling, and interactive web applications.',
      linkedinUrl: 'https://linkedin.com/company/vertex-design',
      twitterUrl: 'https://twitter.com/vertexdesign',
    },
    {
      name: 'GreenFlow Dynamics',
      logoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=160&auto=format&fit=crop&q=80',
      website: 'https://greenflow.example.com',
      industry: 'CleanTech & Renewable Energy',
      location: 'Seattle, WA',
      companySize: '51-200 employees',
      foundedYear: 2017,
      description: 'GreenFlow powers smart distributed energy grids, predictive battery storage management, and industrial carbon tracking metrics.',
      linkedinUrl: 'https://linkedin.com/company/greenflow',
      twitterUrl: 'https://twitter.com/greenflow',
    },
    {
      name: 'Apex Cloud Systems',
      logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=160&auto=format&fit=crop&q=80',
      website: 'https://apexcloud.example.com',
      industry: 'Cloud Infrastructure & Kubernetes',
      location: 'Chicago, IL',
      companySize: '250-500 employees',
      foundedYear: 2019,
      description: 'Apex Cloud delivers enterprise Kubernetes orchestration, automated multi-cloud failover, and high-performance container registries.',
      linkedinUrl: 'https://linkedin.com/company/apex-cloud',
      twitterUrl: 'https://twitter.com/apexcloud',
    },
    {
      name: 'QuantumLeap AI',
      logoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=160&auto=format&fit=crop&q=80',
      website: 'https://quantumleap.example.com',
      industry: 'Artificial Intelligence & Large Language Models',
      location: 'San Francisco, CA',
      companySize: '100-250 employees',
      foundedYear: 2022,
      description: 'QuantumLeap AI develops state-of-the-art foundation models, autonomous agent frameworks, and context retrieval engines for developers.',
      linkedinUrl: 'https://linkedin.com/company/quantumleap-ai',
      twitterUrl: 'https://twitter.com/quantumleapai',
    },
  ];

  const companies: any[] = [];
  for (const c of companiesData) {
    const company = await prisma.company.create({ data: c });
    companies.push(company);
  }

  // ==========================================
  // 4. RECRUITER PROFILES
  // ==========================================
  const recruiter1 = await prisma.recruiterProfile.create({
    data: {
      userId: recruiterUser1.id,
      companyId: companies[0].id, // TechNova
      designation: 'Head of Global Talent Acquisition',
    },
  });

  const recruiter2 = await prisma.recruiterProfile.create({
    data: {
      userId: recruiterUser2.id,
      companyId: companies[1].id, // Nexus FinTech
      designation: 'Senior Technical Recruiter',
    },
  });

  const recruiter3 = await prisma.recruiterProfile.create({
    data: {
      userId: recruiterUser3.id,
      companyId: companies[2].id, // HealthPulse AI
      designation: 'People & Culture Manager',
    },
  });

  const recruiter4 = await prisma.recruiterProfile.create({
    data: {
      userId: recruiterUser4.id,
      companyId: companies[3].id, // CyberShield Labs
      designation: 'Lead Engineering Recruiter',
    },
  });

  // ==========================================
  // 5. JOB CATEGORIES
  // ==========================================
  const categoriesData = [
    { name: 'Software Engineering', slug: 'software-engineering', icon: 'Code', description: 'Web, mobile, backend, full stack, and distributed software engineering roles.' },
    { name: 'Data Science & AI', slug: 'data-science-ai', icon: 'Brain', description: 'Machine learning, generative AI, big data, analytics, and data pipeline positions.' },
    { name: 'Product & Design', slug: 'product-design', icon: 'Palette', description: 'UI/UX design, design systems, product management, and creative direction.' },
    { name: 'Cloud & DevOps', slug: 'cloud-devops', icon: 'Cloud', description: 'Cloud architecture, Kubernetes, AWS/Azure/GCP infrastructure, and CI/CD operations.' },
    { name: 'Cybersecurity', slug: 'cybersecurity', icon: 'ShieldCheck', description: 'Threat analysis, penetration testing, compliance, and zero trust architecture.' },
    { name: 'Marketing & Sales', slug: 'marketing-sales', icon: 'TrendingUp', description: 'Growth marketing, product marketing, content strategy, and enterprise sales.' },
    { name: 'Human Resources', slug: 'human-resources', icon: 'Users', description: 'People operations, recruiting, onboarding, and organizational culture.' },
  ];

  const categories: any[] = [];
  for (const cat of categoriesData) {
    const category = await prisma.jobCategory.create({ data: cat });
    categories.push(category);
  }

  // ==========================================
  // 6. MASTER SKILLS
  // ==========================================
  const skillsData = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'JavaScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Language' },
    { name: 'Go (Golang)', category: 'Language' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'GraphQL', category: 'API' },
    { name: 'REST APIs', category: 'API' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Figma', category: 'Design' },
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Machine Learning', category: 'AI' },
    { name: 'TensorFlow / PyTorch', category: 'AI' },
    { name: 'Cybersecurity', category: 'Security' },
  ];

  const skills: any[] = [];
  for (const s of skillsData) {
    const skill = await prisma.skill.create({ data: s });
    skills.push(skill);
  }

  // ==========================================
  // 7. CANDIDATE PROFILES & EXPERIENCES
  // ==========================================
  const candidateProfiles: any[] = [];
  const candidateTitles = [
    'Senior Full Stack Engineer | React, Node.js & Cloud',
    'Machine Learning Engineer | NLP & Deep Learning',
    'Lead Product Designer | Design Systems & UX Research',
    'Senior DevOps / SRE Specialist | Kubernetes & AWS',
    'FinTech Software Engineer | High Frequency & Go',
    'Frontend Developer | Modern Web Apps & Performance',
    'Data Scientist | Statistical Modeling & Python',
    'Cybersecurity Analyst | Threat Hunting & Zero Trust',
    'Product Manager | SaaS Growth & Agile Roadmaps',
    'Junior Software Developer | TypeScript Enthusiast',
    'Backend Engineer | Distributed Systems & Rust',
    'Mobile Application Engineer | React Native & iOS',
    'Cloud Solutions Architect | AWS & GCP',
    'Quality Assurance Lead | Automated Testing & Cypress',
    'Site Reliability Engineer | Observability & Datadog',
    'Blockchain & Cryptography Developer | Solidity & EVM',
    'Growth Marketer & Technical Writer | SaaS Acquisition',
    'Technical Recruiter & People Partner | HR Tech',
  ];

  for (let i = 0; i < candidateUsers.length; i++) {
    const user = candidateUsers[i];
    const profile = await prisma.candidateProfile.create({
      data: {
        userId: user.id,
        headline: candidateTitles[i],
        bio: `Accomplished and driven technology professional with an eye for detail, scalability, and impact. Over ${3 + (i % 5)} years building real-world software, collaborating in agile cross-functional teams, and shipping production products.`,
        location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Remote'][i % 6],
        photoUrl: `https://images.unsplash.com/photo-${1534528741775 + i * 1000}?w=160&auto=format&fit=crop&q=80`,
        linkedinUrl: `https://linkedin.com/in/${user.name.toLowerCase().replace(/[^a-z]/g, '')}`,
        githubUrl: `https://github.com/${user.name.toLowerCase().replace(/[^a-z]/g, '')}`,
        portfolioUrl: `https://${user.name.toLowerCase().replace(/[^a-z]/g, '')}.dev`,
      },
    });

    // Resume
    await prisma.resume.create({
      data: {
        candidateProfileId: profile.id,
        fileName: `${user.name.replace(/\s+/g, '_')}_Resume_2026.pdf`,
        fileUrl: `/uploads/resumes/${user.name.replace(/\s+/g, '_')}_Resume_2026.pdf`,
        fileSize: 245000 + i * 15000,
        fileType: 'application/pdf',
        isDefault: true,
      },
    });

    // Education
    await prisma.education.create({
      data: {
        candidateProfileId: profile.id,
        institution: ['University of California, Berkeley', 'MIT', 'Stanford University', 'University of Washington', 'Carnegie Mellon University'][i % 5],
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Software Engineering',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2022-06-15'),
        grade: '3.85 / 4.0 GPA',
      },
    });

    // Experience
    await prisma.experience.create({
      data: {
        candidateProfileId: profile.id,
        company: ['Stripe', 'Cloudflare', 'Datadog', 'Shopify', 'Twilio'][i % 5],
        title: candidateTitles[i].split('|')[0].trim(),
        location: 'San Francisco, CA',
        startDate: new Date('2022-07-01'),
        current: true,
        description: 'Architected microservices handling 20k+ RPM, improved frontend page loads by 42%, and maintained robust automated test pipelines.',
      },
    });

    // Attach Skills
    const assignedSkills = skills.slice(i % 5, (i % 5) + 5);
    for (const sk of assignedSkills) {
      await prisma.candidateSkill.create({
        data: {
          candidateProfileId: profile.id,
          skillId: sk.id,
          yearsOfExperience: 3 + (i % 4),
        },
      });
    }

    candidateProfiles.push(profile);
  }

  // ==========================================
  // 8. JOB POSTINGS (26 Varied Roles)
  // ==========================================
  const jobsData = [
    // TechNova Roles (Recruiter 1)
    {
      title: 'Senior Full Stack Engineer (Next.js & Node)',
      companyIndex: 0,
      recruiter: recruiter1,
      categoryIndex: 0,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'Remote (US/Canada)',
      salaryMin: 140000,
      salaryMax: 180000,
      featured: true,
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      description: 'We are seeking an experienced Senior Full Stack Engineer to lead the architecture of our cloud-native workflow platform. You will build high-impact customer-facing features using Next.js and robust distributed backend services.',
      responsibilities: 'Design and maintain modular React/Next.js frontend systems.\nArchitect performant server-side APIs and PostgreSQL database models.\nChampion clean code, unit testing, and automated CI/CD practices.\nMentor junior developers and conduct architectural reviews.',
      requirements: '5+ years of full-stack software development experience.\nProficiency in React, TypeScript, and modern Node.js web frameworks.\nStrong relational database design skills (PostgreSQL or similar).\nExperience with containerized deployments (Docker/Kubernetes).',
      benefits: 'Competitive base salary + equity options\n100% remote work flexibility\nComprehensive medical, dental, and vision health coverage\n$2,500 annual personal learning and conference stipend',
    },
    {
      title: 'Cloud DevOps & Platform Engineer',
      companyIndex: 0,
      recruiter: recruiter1,
      categoryIndex: 3,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      location: 'San Francisco, CA',
      salaryMin: 125000,
      salaryMax: 160000,
      featured: false,
      skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'PostgreSQL'],
      description: 'Help TechNova automate, secure, and scale multi-region infrastructure hosting millions of enterprise transactions every month.',
      responsibilities: 'Build infrastructure as code using Terraform and GitOps.\nOversee Kubernetes clusters, monitoring, alerting, and incident response.\nOptimize AWS infrastructure spend and enforce least-privilege security.',
      requirements: '3+ years in DevOps, Platform, or SRE roles.\nHands-on mastery of Kubernetes, AWS services, and Docker.\nStrong scripting skills in Python or Bash.',
      benefits: 'Competitive salary + annual bonus\nCommuter benefits and catered lunches\n4 weeks paid time off',
    },
    {
      title: 'Principal Distributed Systems Architect',
      companyIndex: 0,
      recruiter: recruiter1,
      categoryIndex: 0,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      experienceLevel: ExperienceLevel.LEAD_EXECUTIVE,
      location: 'San Francisco, CA',
      salaryMin: 180000,
      salaryMax: 235000,
      featured: true,
      skills: ['Go (Golang)', 'PostgreSQL', 'Kubernetes', 'Docker', 'AWS'],
      description: 'Lead the overarching architectural roadmap for TechNova high-throughput distributed messaging and data streaming fabrics.',
      responsibilities: 'Architect sub-millisecond event streaming backbones.\nDrive technical standards across 6 backend engineering pods.\nConduct system load simulations and disaster recovery drills.',
      requirements: '8+ years engineering distributed backend architectures.\nDeep experience with Go or Rust, distributed caching, and Raft consensus.',
      benefits: 'Executive equity package\nComprehensive wellness benefits\nUnlimited paid time off',
    },
    {
      title: 'Junior Full Stack Engineer (Internship)',
      companyIndex: 0,
      recruiter: recruiter1,
      categoryIndex: 0,
      jobType: JobType.INTERNSHIP,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.ENTRY_LEVEL,
      location: 'Remote (US)',
      salaryMin: 70000,
      salaryMax: 90000,
      featured: false,
      skills: ['React', 'TypeScript', 'JavaScript', 'Node.js'],
      description: 'Kickstart your career working alongside senior engineers on real-world production web applications. You will learn modern full-stack practices and ship features directly to users.',
      responsibilities: 'Build interactive UI components using React and Tailwind CSS.\nImplement RESTful endpoints and write integration tests.\nParticipate in daily standups and engineering design reviews.',
      requirements: 'Strong understanding of JavaScript, React, and HTML/CSS.\nEnrolled in Computer Science or recent bootcamp graduate.\nPassion for building responsive, accessible web software.',
      benefits: 'Paid 6-month internship with conversion opportunity\nDedicated senior developer mentorship\nHome office equipment budget',
    },
    {
      title: 'Site Reliability Engineer (SRE)',
      companyIndex: 0,
      recruiter: recruiter1,
      categoryIndex: 3,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      location: 'Remote',
      salaryMin: 130000,
      salaryMax: 165000,
      featured: false,
      skills: ['Kubernetes', 'Docker', 'Python', 'AWS'],
      description: 'Ensure our cloud services meet four-nines reliability goals with modern observability, SLO tracking, and chaos engineering.',
      responsibilities: 'Implement Prometheus and Datadog monitoring dashboards.\nParticipate in on-call rotation with blameless post-mortems.\nAutomate repetitive operational toil through Python scripts.',
      requirements: '3+ years managing production cloud workloads on AWS or GCP.\nDeep understanding of Linux systems and container orchestration.',
      benefits: 'Flexible working hours\nOn-call compensation stipend\nHealth, dental, vision coverage',
    },
    // Nexus FinTech Roles (Recruiter 2)
    {
      title: 'Senior Frontend Architect',
      companyIndex: 1,
      recruiter: recruiter2,
      categoryIndex: 0,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'New York, NY (Remote)',
      salaryMin: 145000,
      salaryMax: 185000,
      featured: true,
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
      description: 'Nexus FinTech is building the next era of high-speed payments interfaces. We need a visionary Frontend Architect who cares deeply about design fidelity, frame rates, and rock-solid state management.',
      responsibilities: 'Set technical direction and design system standards across our web apps.\nEnforce sub-second page loads and zero layout shift web metrics.\nCollaborate tightly with Product Designers and Security teams.',
      requirements: '6+ years specializing in modern web frontend architecture.\nMaster-level grasp of TypeScript, React internals, and CSS architecture.\nFamiliarity with real-time financial charting and data streaming.',
      benefits: 'Annual performance bonuses\nComprehensive health & wellness plan\nGenerous parental leave',
    },
    {
      title: 'Quantitative Trading Systems Engineer',
      companyIndex: 1,
      recruiter: recruiter2,
      categoryIndex: 0,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'New York, NY',
      salaryMin: 170000,
      salaryMax: 220000,
      featured: false,
      skills: ['Python', 'Go (Golang)', 'PostgreSQL', 'Docker'],
      description: 'Build low-latency execution engines, order matching protocols, and automated trade settlement pipelines for institutional asset markets.',
      responsibilities: 'Write ultra-low-latency Go algorithms for market data ingest.\nOptimize database write throughput for financial transaction logs.\nWork with quantitative researchers to backtest trading models.',
      requirements: '5+ years in high-performance backend software engineering.\nSolid grasp of concurrency, lock-free memory structures, and socket networking.',
      benefits: 'Competitive base + trading bonus pool\nSubsidized Wall Street office amenities\nExecutive medical coverage',
    },
    {
      title: 'Core Payments API Developer',
      companyIndex: 1,
      recruiter: recruiter2,
      categoryIndex: 0,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      location: 'Remote (US)',
      salaryMin: 130000,
      salaryMax: 160000,
      featured: false,
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'REST APIs'],
      description: 'Create developer-friendly, reliable REST and webhook interfaces powering cross-border merchant checkouts.',
      responsibilities: 'Design backward-compatible public API endpoints.\nEnforce idempotency keys and multi-currency exchange reconciliations.\nWrite developer documentation and client SDKs.',
      requirements: '3+ years building production RESTful APIs in Node.js or TypeScript.\nDeep knowledge of database transactions and ACID compliance.',
      benefits: 'Work from anywhere in the Americas\nLearning stipend\n401(k) matching up to 5%',
    },
    // HealthPulse AI Roles (Recruiter 3)
    {
      title: 'Staff AI / Machine Learning Scientist',
      companyIndex: 2,
      recruiter: recruiter3,
      categoryIndex: 1,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      experienceLevel: ExperienceLevel.LEAD_EXECUTIVE,
      location: 'Boston, MA (Hybrid)',
      salaryMin: 165000,
      salaryMax: 215000,
      featured: true,
      skills: ['Python', 'Machine Learning', 'TensorFlow / PyTorch', 'PostgreSQL', 'Docker'],
      description: 'Join HealthPulse AI to develop frontier deep learning models that empower physicians with real-time diagnostic assists and actionable predictive patient data.',
      responsibilities: 'Train, fine-tune, and evaluate deep neural networks for clinical data.\nOptimize inference latency for low-power edge and on-prem hospital environments.\nPublish findings and collaborate with top academic medical institutions.',
      requirements: 'Ph.D. or Master’s in Computer Science, Machine Learning, or Computational Biology.\nTrack record of shipping production ML systems in PyTorch or TensorFlow.\nExperience with healthcare data governance (HIPAA, FHIR).',
      benefits: 'Top-tier compensation and equity grants\n401(k) matching up to 5%\nFlexible hybrid schedule (2 days in-office)',
    },
    {
      title: 'Clinical Data Platform Engineer',
      companyIndex: 2,
      recruiter: recruiter3,
      categoryIndex: 1,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      location: 'Boston, MA (Remote)',
      salaryMin: 135000,
      salaryMax: 165000,
      featured: false,
      skills: ['Python', 'PostgreSQL', 'Docker', 'REST APIs'],
      description: 'Build safe, compliant ETL pipelines processing millions of de-identified patient telemetry streams and medical imaging datasets.',
      responsibilities: 'Architect automated data ingestion pipelines from EHR systems.\nValidate schema standards and enforce encryption in transit and at rest.\nProvide sanitized data marts to AI research scientists.',
      requirements: '3+ years in data engineering or backend software development.\nFamiliarity with HIPAA compliant infrastructure and Python data stacks.',
      benefits: 'Comprehensive health plans\nFlexible hours\nPaid conference attendance',
    },
    // CyberShield Labs Roles (Recruiter 4)
    {
      title: 'Cybersecurity Threat Hunter',
      companyIndex: 3,
      recruiter: recruiter4,
      categoryIndex: 4,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.ON_SITE,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'Austin, TX',
      salaryMin: 130000,
      salaryMax: 165000,
      featured: false,
      skills: ['Cybersecurity', 'Python', 'Docker', 'AWS'],
      description: 'Investigate modern cyber-attack vectors, build automated heuristic detection rules, and fortify enterprise infrastructure against advanced persistent threats.',
      responsibilities: 'Analyze zero-day vulnerability exploits and malware signatures.\nBuild automated threat response playbooks.\nConduct penetration testing across cloud workloads and networks.',
      requirements: '4+ years in SOC, Incident Response, or Red Teaming.\nProficiency with reverse engineering, packet analysis, and Python.\nIndustry certifications (OSCP, CISSP) highly valued.',
      benefits: 'Top-tier base salary\nRelocation assistance to Austin, TX\nAnnual security conference pass (BlackHat/DEF CON)',
    },
    {
      title: 'Zero Trust Security Architect',
      companyIndex: 3,
      recruiter: recruiter4,
      categoryIndex: 4,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.LEAD_EXECUTIVE,
      location: 'Austin, TX (Remote)',
      salaryMin: 160000,
      salaryMax: 205000,
      featured: true,
      skills: ['Cybersecurity', 'AWS', 'Kubernetes', 'Docker'],
      description: 'Lead identity-first access control architectures, mTLS microservice authorization, and cryptographic governance for Fortune 100 enterprise clients.',
      responsibilities: 'Design identity federation across Okta, AWS IAM, and Kubernetes.\nAudit system architecture against NIST and ISO 27001 standards.\nGuide customer C-suites on cloud perimeter defense strategies.',
      requirements: '7+ years leading enterprise cybersecurity architectures.\nDemonstrated mastery of Zero Trust architecture and micro-segmentation.',
      benefits: 'Executive compensation package\nFull remote flexibility\nUnlimited PTO',
    },
    // Vertex Media & Design Roles
    {
      title: 'Lead Product Designer (UI / UX & Systems)',
      companyIndex: 4,
      recruiter: null,
      categoryIndex: 2,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'Los Angeles, CA (Remote)',
      salaryMin: 130000,
      salaryMax: 170000,
      featured: true,
      skills: ['Figma', 'UI/UX Design', 'Tailwind CSS', 'TypeScript'],
      description: 'Vertex Media & Design is looking for an extraordinary Lead Product Designer to sculpt our interactive spatial products and enterprise design system.',
      responsibilities: 'Create beautiful, intuitive user journeys and component systems in Figma.\nConduct user interviews, prototype interactions, and iterate rapidly.\nPartner with engineers to ensure pixel-perfect CSS implementations.',
      requirements: '5+ years crafting consumer or SaaS software interfaces.\nExceptional portfolio demonstrating craft, systems thinking, and typography.\nStrong familiarity with frontend web mechanics and accessibility (WCAG).',
      benefits: 'Creative equipment stipend (Latest MacBook Pro, 4K monitors)\nFlexible unlimited PTO\nAnnual design retreat abroad',
    },
    {
      title: 'Senior 3D Interactive Web Developer',
      companyIndex: 4,
      recruiter: null,
      categoryIndex: 0,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'Los Angeles, CA',
      salaryMin: 135000,
      salaryMax: 175000,
      featured: false,
      skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS'],
      description: 'Build web-based 3D visual experiences, Three.js scenes, and fluid WebGL interactions for high-profile digital campaigns.',
      responsibilities: 'Write custom WebGL shaders and optimized Three.js canvas components.\nEnsure smooth 60fps rendering across desktop and mobile devices.\nPartner with 3D modelers and creative directors.',
      requirements: '4+ years building interactive web experiences with Three.js or WebGL.\nSolid math foundations (matrices, vectors, geometry algorithms).',
      benefits: 'Remote-first culture\nHigh-end GPU workstation budget\nGenerous creative project bonuses',
    },
    // GreenFlow Dynamics Roles
    {
      title: 'CleanTech Embedded IoT Firmware Engineer',
      companyIndex: 5,
      recruiter: null,
      categoryIndex: 0,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.ON_SITE,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      location: 'Seattle, WA',
      salaryMin: 115000,
      salaryMax: 145000,
      featured: false,
      skills: ['Python', 'Docker', 'REST APIs'],
      description: 'Develop real-time sensor firmware managing industrial solar array arrays, smart battery banks, and electric vehicle charging hubs.',
      responsibilities: 'Write low-power firmware for ARM microcontrollers.\nImplement secure MQTT and cellular telemetry to our cloud backend.\nConduct field testing and hardware-in-the-loop validation.',
      requirements: '3+ years embedded C/C++ or embedded Python development.\nFamiliarity with hardware communication protocols (SPI, I2C, CAN bus).',
      benefits: 'Eco-commuter transit passes\nClean energy investment discounts\nComprehensive medical coverage',
    },
    {
      title: 'Renewable Grid Data Analyst',
      companyIndex: 5,
      recruiter: null,
      categoryIndex: 1,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      experienceLevel: ExperienceLevel.ENTRY_LEVEL,
      location: 'Seattle, WA',
      salaryMin: 85000,
      salaryMax: 110000,
      featured: false,
      skills: ['Python', 'PostgreSQL', 'Machine Learning'],
      description: 'Analyze real-time regional weather patterns and power generation outputs to forecast green grid capacity.',
      responsibilities: 'Build automated forecasting models in Python.\nCreate interactive executive dashboards detailing carbon offsets.\nCollaborate with utility partners and environmental scientists.',
      requirements: 'Degree in Data Analytics, Environmental Science, or Computer Science.\nProficiency in SQL, Python pandas, and data visualization tools.',
      benefits: 'Hybrid schedule (3 days remote)\nTuition reimbursement program\nGenerous 401(k) matching',
    },
    // Apex Cloud Systems Roles
    {
      title: 'Senior Kubernetes Infrastructure Engineer',
      companyIndex: 6,
      recruiter: null,
      categoryIndex: 3,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'Chicago, IL (Remote)',
      salaryMin: 150000,
      salaryMax: 190000,
      featured: true,
      skills: ['Kubernetes', 'Docker', 'AWS', 'Go (Golang)', 'Python'],
      description: 'Help develop custom Kubernetes CRDs, operators, and multi-tenant isolation layers for high-demand enterprise clouds.',
      responsibilities: 'Write custom Kubernetes controllers in Go.\nOptimize cluster networking with Cilium and eBPF.\nManage zero-downtime control plane upgrades across 40+ clusters.',
      requirements: '5+ years managing large-scale Kubernetes production installations.\nProficiency in Go and deep familiarity with the k8s API machinery.',
      benefits: '100% remote anywhere in North America\nHome office setup allowance\nAnnual technology stipend',
    },
    {
      title: 'Multi-Cloud Solutions Architect',
      companyIndex: 6,
      recruiter: null,
      categoryIndex: 3,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      experienceLevel: ExperienceLevel.LEAD_EXECUTIVE,
      location: 'Chicago, IL',
      salaryMin: 165000,
      salaryMax: 210000,
      featured: false,
      skills: ['AWS', 'Kubernetes', 'Docker', 'REST APIs'],
      description: 'Consult directly with enterprise CTOs to architect disaster-resilient cloud migrations bridging AWS, Azure, and private data centers.',
      responsibilities: 'Deliver detailed architecture blueprints and proof-of-concept deployments.\nLead executive technical briefings and security audits.\nCollaborate with product engineering to identify platform gaps.',
      requirements: '7+ years architecting enterprise cloud architectures.\nRecognized AWS/Azure Solutions Architect Professional certifications.',
      benefits: 'Competitive executive salary + quarterly bonuses\nComprehensive premium health benefits\n4 weeks paid vacation',
    },
    // QuantumLeap AI Roles
    {
      title: 'Generative AI & LLM Systems Engineer',
      companyIndex: 7,
      recruiter: null,
      categoryIndex: 1,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR_LEVEL,
      location: 'San Francisco, CA (Remote)',
      salaryMin: 160000,
      salaryMax: 210000,
      featured: true,
      skills: ['Python', 'Machine Learning', 'TensorFlow / PyTorch', 'Docker'],
      description: 'Build low-latency inference pipelines, context caching, and autonomous tool-calling agent systems powered by state-of-the-art LLMs.',
      responsibilities: 'Optimize vLLM and TensorRT-LLM server clusters for maximum token throughput.\nDesign vector retrieval pipelines with hybrid search and rerankers.\nConduct red-teaming evaluations on model safety and hallucination rates.',
      requirements: '4+ years software engineering with deep hands-on LLM pipeline experience.\nProficiency with PyTorch, CUDA fundamentals, and Python concurrency.',
      benefits: 'Early-stage equity grants in high-growth AI venture\nWork with world-class ML researchers\nUnlimited compute credits for personal research',
    },
    {
      title: 'AI Product Manager (Developer Platform)',
      companyIndex: 7,
      recruiter: null,
      categoryIndex: 2,
      jobType: JobType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      experienceLevel: ExperienceLevel.MID_LEVEL,
      location: 'San Francisco, CA',
      salaryMin: 140000,
      salaryMax: 180000,
      featured: false,
      skills: ['REST APIs', 'UI/UX Design', 'Python'],
      description: 'Shape the developer experience for our AI APIs, SDKs, and developer portal. You will turn cutting-edge model capabilities into intuitive developer products.',
      responsibilities: 'Gather customer feedback from thousands of AI engineers and startup founders.\nDefine developer API specs, pricing models, and documentation workflows.\nWork with engineering to prioritize features and maintain roadmap clarity.',
      requirements: '3+ years product management experience on developer APIs or technical SaaS.\nAbility to write code and test APIs independently.',
      benefits: 'Top compensation + equity\nDowntown SF office with catered meals\nFull medical and retirement coverage',
    },
  ];

  const jobs: any[] = [];
  for (const j of jobsData) {
    const job = await prisma.job.create({
      data: {
        title: j.title,
        companyId: companies[j.companyIndex].id,
        recruiterId: j.recruiter ? j.recruiter.id : null,
        categoryId: categories[j.categoryIndex].id,
        jobType: j.jobType,
        workMode: j.workMode,
        experienceLevel: j.experienceLevel,
        location: j.location,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        featured: j.featured,
        skills: j.skills,
        description: j.description,
        responsibilities: j.responsibilities,
        requirements: j.requirements,
        benefits: j.benefits,
        status: JobStatus.ACTIVE,
        deadline: new Date(Date.now() + 86400000 * (15 + (jobs.length % 20))),
      },
      include: { company: true },
    });
    jobs.push(job);
  }

  // ==========================================
  // 9. APPLICATIONS (BALANCED ACROSS KANBAN STAGES)
  // ==========================================

  // TechNova (Recruiter 1) specific applications across ALL 6 stages
  const techNovaJob1 = jobs[0]; // Senior Full Stack
  const techNovaJob2 = jobs[1]; // Cloud DevOps
  const techNovaJob3 = jobs[3]; // Junior Full Stack

  // 1. Alex Morgan (Candidate 1) -> TechNova Senior Full Stack -> INTERVIEW
  const alexResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[0].id } });
  const app1 = await prisma.application.create({
    data: {
      jobId: techNovaJob1.id,
      candidateProfileId: candidateProfiles[0].id,
      resumeId: alexResume?.id,
      status: ApplicationStatus.INTERVIEW,
      coverLetter: 'Dear Hiring Team at TechNova,\n\nI am thrilled to submit my application for the Senior Full Stack Engineer role. With extensive experience architecting production React and Next.js applications backed by high-throughput PostgreSQL databases, I believe my background aligns directly with your technical stack and roadmap.\n\nLooking forward to speaking with the team.\n\nBest regards,\nAlex Morgan',
      notes: 'Strong candidate with deep Next.js experience. Moving directly to Technical & Architecture interview round.',
    },
  });

  // Schedule Interview for Alex Morgan
  await prisma.interview.create({
    data: {
      applicationId: app1.id,
      scheduledAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
      locationOrLink: 'https://meet.google.com/hub-tech-interview',
      interviewType: 'Round 1: System Design & Next.js Architecture',
      status: 'SCHEDULED',
      notes: 'Panel includes Lead Architect and Engineering Manager.',
    },
  });

  // 2. Priya Sharma -> TechNova Senior Full Stack -> SHORTLISTED
  const priyaResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[1].id } });
  await prisma.application.create({
    data: {
      jobId: techNovaJob1.id,
      candidateProfileId: candidateProfiles[1].id,
      resumeId: priyaResume?.id,
      status: ApplicationStatus.SHORTLISTED,
      coverLetter: 'Hello TechNova team,\nI have been following your recent enterprise cloud announcements with admiration. Having spent the past 4 years delivering scalable TypeScript and React workflows, I would love the chance to contribute to your platform.',
      notes: 'Impressive GitHub contributions and clean code samples. Shortlisted for upcoming panel interviews.',
    },
  });

  // 3. Marcus Vance -> TechNova Senior Full Stack -> UNDER_REVIEW
  const marcusResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[2].id } });
  await prisma.application.create({
    data: {
      jobId: techNovaJob1.id,
      candidateProfileId: candidateProfiles[2].id,
      resumeId: marcusResume?.id,
      status: ApplicationStatus.UNDER_REVIEW,
      coverLetter: 'Hi Sarah,\nMy background in containerized cloud microservices and Node.js backend development makes me a great fit for the Senior Full Stack position.',
      notes: 'Screened by recruiting coordinator. Resume forwarded to hiring manager for review.',
    },
  });

  // 4. Elena Rostova -> TechNova Senior Full Stack -> APPLIED
  const elenaResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[3].id } });
  await prisma.application.create({
    data: {
      jobId: techNovaJob1.id,
      candidateProfileId: candidateProfiles[3].id,
      resumeId: elenaResume?.id,
      status: ApplicationStatus.APPLIED,
      coverLetter: 'Dear Hiring Committee,\nPlease review my enclosed resume for the Senior Full Stack role. I have over 5 years of experience building modern web architectures.',
      notes: 'New applicant received today.',
    },
  });

  // 5. Liam O Connor -> TechNova Cloud DevOps -> INTERVIEW
  const liamResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[4].id } });
  const app5 = await prisma.application.create({
    data: {
      jobId: techNovaJob2.id,
      candidateProfileId: candidateProfiles[4].id,
      resumeId: liamResume?.id,
      status: ApplicationStatus.INTERVIEW,
      coverLetter: 'Dear TechNova Team,\nAs an experienced Kubernetes and AWS administrator with production experience maintaining zero-downtime GitOps pipelines, I am excited by this opportunity.',
      notes: 'Passed initial recruiter phone screen with flying colors.',
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: app5.id,
      scheduledAt: new Date(Date.now() + 86400000 * 3), // 3 days from now
      locationOrLink: 'https://meet.google.com/devops-panel-meet',
      interviewType: 'Round 2: Kubernetes & Infrastructure Automation Live Lab',
      status: 'SCHEDULED',
      notes: 'Candidate will perform live debugging in an isolated sandbox cluster.',
    },
  });

  // 6. Sofia Rodriguez -> TechNova Cloud DevOps -> SHORTLISTED
  const sofiaResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[5].id } });
  await prisma.application.create({
    data: {
      jobId: techNovaJob2.id,
      candidateProfileId: candidateProfiles[5].id,
      resumeId: sofiaResume?.id,
      status: ApplicationStatus.SHORTLISTED,
      coverLetter: 'Greetings TechNova recruiters,\nI specialize in Terraform automation and AWS cloud cost optimization. I would be thrilled to bring these capabilities to your platform team.',
      notes: 'Certified AWS Solutions Architect with strong recommendations.',
    },
  });

  // 7. Daniel Kim -> TechNova Cloud DevOps -> APPLIED
  const danielResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[6].id } });
  await prisma.application.create({
    data: {
      jobId: techNovaJob2.id,
      candidateProfileId: candidateProfiles[6].id,
      resumeId: danielResume?.id,
      status: ApplicationStatus.APPLIED,
      coverLetter: 'Dear TechNova hiring staff,\nPlease consider my application for the Cloud DevOps position. I am passionate about cloud infrastructure automation and security.',
      notes: 'Awaiting initial profile review.',
    },
  });

  // 8. Chloe Bennett -> TechNova Junior Full Stack -> SELECTED
  const chloeResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[7].id } });
  await prisma.application.create({
    data: {
      jobId: techNovaJob3.id,
      candidateProfileId: candidateProfiles[7].id,
      resumeId: chloeResume?.id,
      status: ApplicationStatus.SELECTED,
      coverLetter: 'Hello TechNova team,\nI am an enthusiastic junior developer who loves building with React, TypeScript, and Tailwind CSS. I would love the chance to learn and ship code with your team.',
      notes: 'Outstanding technical presentation and cultural fit. Formal offer extended and accepted.',
    },
  });

  // 9. James Wilson -> TechNova Junior Full Stack -> REJECTED
  const jamesResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[8].id } });
  await prisma.application.create({
    data: {
      jobId: techNovaJob3.id,
      candidateProfileId: candidateProfiles[8].id,
      resumeId: jamesResume?.id,
      status: ApplicationStatus.REJECTED,
      coverLetter: 'Dear Hiring Manager,\nI am applying for the Junior Full Stack position to expand my skillset.',
      notes: 'Candidate withdrew due to conflicting graduation timeline. Rejection status logged.',
    },
  });

  // 10. Aisha Patel -> TechNova Principal Architect -> UNDER_REVIEW
  const aishaResume = await prisma.resume.findFirst({ where: { candidateProfileId: candidateProfiles[9].id } });
  await prisma.application.create({
    data: {
      jobId: jobs[2].id, // Principal Systems Architect
      candidateProfileId: candidateProfiles[9].id,
      resumeId: aishaResume?.id,
      status: ApplicationStatus.UNDER_REVIEW,
      coverLetter: 'Dear TechNova Leadership,\nHaving engineered distributed streaming systems serving 100k requests/sec at Stripe and Cloudflare, I am very excited about the Principal Architect roadmap at TechNova.',
      notes: 'Strong candidate profile. Distributed to Executive Architecture board for evaluation.',
    },
  });

  // Additional applications across other companies for Candidate Alex Morgan
  // Nexus FinTech -> Senior Frontend Architect -> SHORTLISTED
  await prisma.application.create({
    data: {
      jobId: jobs[5].id, // Senior Frontend Architect
      candidateProfileId: candidateProfiles[0].id,
      resumeId: alexResume?.id,
      status: ApplicationStatus.SHORTLISTED,
      coverLetter: 'Dear Nexus FinTech Team,\nMy passion is crafting high-fidelity, instantaneous web financial interfaces. With 5 years mastering TypeScript and React, I would love to shape your next-generation payment interfaces.',
      notes: 'Candidate portfolio passed design and frontend engineering review.',
    },
  });

  // QuantumLeap AI -> Generative AI Engineer -> APPLIED
  await prisma.application.create({
    data: {
      jobId: jobs[18].id, // Generative AI Engineer
      candidateProfileId: candidateProfiles[0].id,
      resumeId: alexResume?.id,
      status: ApplicationStatus.APPLIED,
      coverLetter: 'Hello QuantumLeap team,\nI have been experimenting with LLM agents and retrieval pipelines, and would love to contribute to your foundation model inference infrastructure.',
      notes: 'Application submitted via CareerHub 1-Click apply.',
    },
  });

  // Vertex Media -> Lead Product Designer -> UNDER_REVIEW
  await prisma.application.create({
    data: {
      jobId: jobs[12].id, // Lead Product Designer
      candidateProfileId: candidateProfiles[0].id,
      resumeId: alexResume?.id,
      status: ApplicationStatus.UNDER_REVIEW,
      coverLetter: 'Dear Vertex Team,\nI admire your creative digital work. I bring a blend of UX research and design systems discipline that would accelerate your team.',
      notes: 'Design portfolio currently being reviewed by creative director.',
    },
  });

  // HealthPulse AI -> Clinical Data Platform -> SELECTED
  await prisma.application.create({
    data: {
      jobId: jobs[9].id, // Clinical Data Platform Engineer
      candidateProfileId: candidateProfiles[0].id,
      resumeId: alexResume?.id,
      status: ApplicationStatus.SELECTED,
      coverLetter: 'Dear HealthPulse AI Hiring Team,\nI am dedicated to applying high-reliability software practices to healthcare systems that directly benefit patient lives.',
      notes: 'Final interview completed with flying colors. Offer extended.',
    },
  });

  // Remaining candidate applications across categories
  for (let i = 10; i < candidateProfiles.length; i++) {
    const prof = candidateProfiles[i];
    const resume = await prisma.resume.findFirst({ where: { candidateProfileId: prof.id } });
    const targetJob = jobs[i % jobs.length];
    const stage = [ApplicationStatus.APPLIED, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEW, ApplicationStatus.SELECTED][i % 5];

    await prisma.application.create({
      data: {
        jobId: targetJob.id,
        candidateProfileId: prof.id,
        resumeId: resume?.id,
        status: stage,
        coverLetter: `Dear Hiring Manager,\nI am thrilled to apply for the ${targetJob.title} position at ${targetJob.company.name}. My experience directly mirrors your requirements.`,
        notes: `Processed in sprint review batch #${i}.`,
      },
    });
  }

  // ==========================================
  // 10. SAVED JOBS (FOR ALEX MORGAN)
  // ==========================================
  await prisma.savedJob.create({ data: { userId: candidateUser1.id, jobId: jobs[0].id } });
  await prisma.savedJob.create({ data: { userId: candidateUser1.id, jobId: jobs[5].id } }); // Senior Frontend Architect
  await prisma.savedJob.create({ data: { userId: candidateUser1.id, jobId: jobs[8].id } }); // Staff AI Scientist
  await prisma.savedJob.create({ data: { userId: candidateUser1.id, jobId: jobs[12].id } }); // Lead Product Designer
  await prisma.savedJob.create({ data: { userId: candidateUser1.id, jobId: jobs[18].id } }); // Generative AI Engineer

  // ==========================================
  // 11. NOTIFICATIONS
  // ==========================================
  // Notifications for Alex Morgan:
  await prisma.notification.create({
    data: {
      userId: candidateUser1.id,
      title: 'Interview Scheduled: TechNova Solutions',
      message: 'TechNova Solutions invited you to "Round 1: System Design & Next.js Architecture". Calendar link is available in your applications dashboard.',
      type: 'INTERVIEW',
      link: '/candidate/applications',
    },
  });

  await prisma.notification.create({
    data: {
      userId: candidateUser1.id,
      title: 'Congratulations! Job Offer Extended',
      message: 'HealthPulse AI has selected your application for "Clinical Data Platform Engineer". Review your offer details.',
      type: 'SELECTION',
      link: '/candidate/applications',
    },
  });

  await prisma.notification.create({
    data: {
      userId: candidateUser1.id,
      title: 'Application Shortlisted',
      message: 'Nexus FinTech moved your application for "Senior Frontend Architect" to the Shortlist stage.',
      type: 'SHORTLISTED',
      link: '/candidate/applications',
    },
  });

  await prisma.notification.create({
    data: {
      userId: candidateUser1.id,
      title: 'New Position Matching Your Skills',
      message: 'QuantumLeap AI posted "Generative AI & LLM Systems Engineer" matching your TypeScript and Python background.',
      type: 'JOB_ALERT',
      link: '/jobs',
    },
  });

  await prisma.notification.create({
    data: {
      userId: candidateUser1.id,
      title: 'Welcome to CareerHub!',
      message: 'Your candidate profile is 100% complete and visible to verified enterprise recruiters.',
      type: 'SYSTEM',
      link: '/candidate/dashboard',
    },
  });

  // Notifications for TechNova Recruiter:
  await prisma.notification.create({
    data: {
      userId: recruiterUser1.id,
      title: 'Interview Scheduled with Alex Morgan',
      message: 'Technical Interview confirmed for Thursday 2:00 PM (Google Meet: https://meet.google.com/hub-tech-interview).',
      type: 'INTERVIEW',
      link: '/recruiter/applications',
    },
  });

  await prisma.notification.create({
    data: {
      userId: recruiterUser1.id,
      title: 'New Application Received',
      message: 'Elena Rostova submitted an application for "Senior Full Stack Engineer (Next.js & Node)".',
      type: 'APPLICATION',
      link: '/recruiter/applications',
    },
  });

  await prisma.notification.create({
    data: {
      userId: recruiterUser1.id,
      title: 'Candidate Offer Accepted',
      message: 'Chloe Bennett accepted the offer for "Junior Full Stack Engineer (Internship)".',
      type: 'APPLICATION',
      link: '/recruiter/applications',
    },
  });

  await prisma.notification.create({
    data: {
      userId: recruiterUser1.id,
      title: 'Pipeline Milestone Reached',
      message: 'Your active job "Senior Full Stack Engineer" has reached 4 qualified applicants this week.',
      type: 'SYSTEM',
      link: '/recruiter/pipeline',
    },
  });

  console.log('✅ CareerHub database seeded successfully with comprehensive demo data!');
  console.log('--- DEMO CREDENTIALS ---');
  console.log('Admin:     admin@careerhub.com     / ' + DEMO_PASSWORD);
  console.log('Recruiter: recruiter@careerhub.com / ' + DEMO_PASSWORD);
  console.log('Candidate: candidate@careerhub.com / ' + DEMO_PASSWORD);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
