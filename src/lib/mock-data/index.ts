import { Task, Brief, CLevelPerformance, BusinessMetrics, CLevelStrategy, CLevelType, TaskStatus } from '@/types';

// Константы для расчета дат (в миллисекундах)
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const TWO_DAYS = 2 * ONE_DAY;
export const THREE_DAYS = 3 * ONE_DAY;
export const FIVE_DAYS = 5 * ONE_DAY;
export const ONE_WEEK = 7 * ONE_DAY;
export const TWO_WEEKS = 14 * ONE_DAY;

// Моковые бизнес-метрики
export const mockBusinessMetrics: BusinessMetrics = {
  ltv: 250000,
  mrr: 45000,
  cashFlow: 120000
};

// Моковые данные о производительности C-Level
export const mockCLevelPerformance: CLevelPerformance[] = [
  {
    clevelType: 'COO',
    completedKpis: 7,
    totalKpis: 10,
    confidenceScore: 85,
    positiveNotes: ['Operational efficiency increased by 15%', 'Supply chain optimized', 'Customer satisfaction improved'],
    negativeNotes: ['Staff turnover remains high']
  },
  {
    clevelType: 'CMO',
    completedKpis: 5,
    totalKpis: 8,
    confidenceScore: 78,
    positiveNotes: ['Brand awareness up 12%', 'Social media engagement doubled'],
    negativeNotes: []
  },
  {
    clevelType: 'CTO',
    completedKpis: 4,
    totalKpis: 6,
    confidenceScore: 92,
    positiveNotes: ['System uptime at 99.9%', 'New features launched on schedule'],
    negativeNotes: []
  },
  {
    clevelType: 'CFO',
    completedKpis: 6,
    totalKpis: 9,
    confidenceScore: 81,
    positiveNotes: ['Cost reduction initiatives successful', 'New investment secured'],
    negativeNotes: ['Accounts receivable cycle longer than target']
  }
];

// Моковые задачи
export const mockTasks: Task[] = [
  // CMO Tasks
  {
    id: '101',
    title: 'Develop Q3 marketing strategy',
    description: 'Create a comprehensive marketing strategy for Q3 2025. Focus on digital channels and brand awareness.',
    clevelType: 'CMO',
    status: 'completed',
    createdAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    updatedAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    completedAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    briefId: '201'
  },
  {
    id: '107',
    title: 'Launch social media campaign',
    description: 'Plan and execute a comprehensive social media campaign to increase brand visibility and engagement.',
    clevelType: 'CMO',
    status: 'in_progress',
    createdAt: new Date(Date.now() - THREE_DAYS).toISOString(),
    updatedAt: new Date(Date.now() - ONE_DAY).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '108',
    title: 'Analyze competitor marketing strategies',
    description: 'Research and analyze marketing strategies of key competitors to identify opportunities and threats.',
    clevelType: 'CMO',
    status: 'pending',
    createdAt: new Date(Date.now() - TWO_DAYS).toISOString(),
    updatedAt: new Date(Date.now() - TWO_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '109',
    title: 'Develop content marketing plan',
    description: 'Create a comprehensive content marketing plan for the next quarter, including blog posts, videos, and social media content.',
    clevelType: 'CMO',
    status: 'failed',
    createdAt: new Date(Date.now() - TWO_WEEKS).toISOString(),
    updatedAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    completedAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    briefId: undefined
  },
  
  // CTO Tasks
  {
    id: '102',
    title: 'Implement new cybersecurity measures',
    description: 'Research and implement enhanced cybersecurity measures to protect company data and systems from emerging threats.',
    clevelType: 'CTO',
    status: 'in_progress',
    createdAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    updatedAt: new Date(Date.now() - ONE_DAY).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '110',
    title: 'Develop cloud migration strategy',
    description: 'Create a comprehensive plan for migrating on-premises infrastructure to the cloud to improve scalability and reduce costs.',
    clevelType: 'CTO',
    status: 'pending',
    createdAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    updatedAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '111',
    title: 'Implement CI/CD pipeline',
    description: 'Set up a continuous integration and continuous deployment pipeline to streamline development and release processes.',
    clevelType: 'CTO',
    status: 'completed',
    createdAt: new Date(Date.now() - TWO_WEEKS).toISOString(),
    updatedAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    completedAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    briefId: undefined
  },
  
  // COO Tasks
  {
    id: '103',
    title: 'Review and optimize operational processes',
    description: 'Conduct a comprehensive review of current operational processes and identify opportunities for optimization and efficiency improvements.',
    clevelType: 'COO',
    status: 'pending',
    createdAt: new Date(Date.now() - THREE_DAYS).toISOString(),
    updatedAt: new Date(Date.now() - THREE_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '112',
    title: 'Implement supply chain improvements',
    description: 'Identify and implement improvements to the supply chain to reduce costs and improve delivery times.',
    clevelType: 'COO',
    status: 'in_progress',
    createdAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    updatedAt: new Date(Date.now() - TWO_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '113',
    title: 'Develop quality assurance framework',
    description: 'Create a comprehensive quality assurance framework to ensure consistent product quality and customer satisfaction.',
    clevelType: 'COO',
    status: 'completed',
    createdAt: new Date(Date.now() - TWO_WEEKS).toISOString(),
    updatedAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    completedAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    briefId: undefined
  },
  
  // CHRO Tasks
  {
    id: '104',
    title: 'Develop talent acquisition strategy',
    description: 'Create a comprehensive strategy for attracting and retaining top talent in a competitive market.',
    clevelType: 'CHRO',
    status: 'failed',
    createdAt: new Date(Date.now() - TWO_WEEKS).toISOString(),
    updatedAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    completedAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    briefId: undefined
  },
  {
    id: '114',
    title: 'Implement employee wellness program',
    description: 'Design and implement a comprehensive employee wellness program to improve health, reduce stress, and boost productivity.',
    clevelType: 'CHRO',
    status: 'in_progress',
    createdAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    updatedAt: new Date(Date.now() - THREE_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '115',
    title: 'Develop leadership training program',
    description: 'Create a comprehensive leadership training program to develop future leaders within the organization.',
    clevelType: 'CHRO',
    status: 'pending',
    createdAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    updatedAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  
  // CFO Tasks
  {
    id: '105',
    title: 'Prepare Q2 financial analysis',
    description: 'Analyze financial performance for Q2 2025. Identify trends, opportunities, and areas for improvement.',
    clevelType: 'CFO',
    status: 'completed',
    createdAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    updatedAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    completedAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    briefId: '202'
  },
  {
    id: '116',
    title: 'Develop investment strategy',
    description: 'Create a comprehensive investment strategy to maximize returns on company cash reserves.',
    clevelType: 'CFO',
    status: 'in_progress',
    createdAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    updatedAt: new Date(Date.now() - TWO_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '117',
    title: 'Optimize tax strategy',
    description: 'Review and optimize the company\'s tax strategy to ensure compliance and minimize tax burden.',
    clevelType: 'CFO',
    status: 'pending',
    createdAt: new Date(Date.now() - THREE_DAYS).toISOString(),
    updatedAt: new Date(Date.now() - THREE_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  
  // CCO Tasks
  {
    id: '106',
    title: 'Analyze customer satisfaction survey results',
    description: 'Review and analyze the results of the recent customer satisfaction survey. Identify key trends, areas for improvement, and actionable insights.',
    clevelType: 'CCO',
    status: 'completed',
    createdAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    updatedAt: new Date(Date.now() - TWO_DAYS).toISOString(),
    completedAt: new Date(Date.now() - TWO_DAYS).toISOString(),
    briefId: '203'
  },
  {
    id: '118',
    title: 'Develop customer retention strategy',
    description: 'Create a comprehensive strategy to improve customer retention and reduce churn.',
    clevelType: 'CCO',
    status: 'in_progress',
    createdAt: new Date(Date.now() - ONE_WEEK).toISOString(),
    updatedAt: new Date(Date.now() - THREE_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  },
  {
    id: '119',
    title: 'Implement customer feedback system',
    description: 'Design and implement a comprehensive system for collecting and acting on customer feedback.',
    clevelType: 'CCO',
    status: 'pending',
    createdAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    updatedAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    completedAt: undefined,
    briefId: undefined
  }
];

// Моковые брифы
export const mockBriefs: Brief[] = [
  {
    id: '201',
    taskId: '101',
    content: 'Marketing strategy for Q3 2025 has been developed with a focus on digital channels and brand awareness. The strategy includes a comprehensive social media campaign, content marketing initiatives, and targeted advertising.\n\nKey components of the strategy:\n\n1. Social Media Campaign\n- Platform focus: Instagram, LinkedIn, Twitter\n- Content types: Educational posts, behind-the-scenes, customer testimonials\n- Frequency: Daily posts with weekly featured content\n\n2. Content Marketing\n- Blog posts: 2 per week focusing on industry trends and product use cases\n- Whitepapers: 1 per month on in-depth topics\n- Video content: Weekly product demonstrations and customer success stories\n\n3. Targeted Advertising\n- Google Ads: Focus on high-intent keywords\n- Social media advertising: Retargeting campaigns and lookalike audiences\n- Industry publications: Banner ads and sponsored content\n\nKey metrics to track include engagement rates, conversion rates, and brand sentiment. The estimated budget for this strategy is $75,000, with an expected ROI of 3.5x based on historical performance.',
    createdAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    recommendations: [
      'Increase budget allocation for Instagram advertising by 20%',
      'Develop a series of educational webinars to showcase product features',
      'Partner with industry influencers to expand reach',
      'Create a dedicated landing page for the Q3 campaign to better track conversions',
      'Implement A/B testing for ad creative to optimize performance'
    ]
  },
  {
    id: '202',
    taskId: '105',
    content: 'Financial analysis for Q2 2025 has been completed. Revenue increased by 15% compared to the previous quarter, while expenses remained stable. Cash flow has improved significantly due to more efficient accounts receivable processes.\n\nKey findings:\n\n1. Revenue Analysis\n- Total revenue: $2.45M (15% increase from Q1)\n- Subscription revenue: $1.8M (73% of total)\n- Professional services: $650K (27% of total)\n- Customer retention rate: 94% (2% increase from Q1)\n\n2. Expense Analysis\n- Total expenses: $1.9M (2% increase from Q1)\n- Personnel costs: $1.2M (63% of total)\n- Marketing and sales: $350K (18% of total)\n- Operations and infrastructure: $250K (13% of total)\n- Other expenses: $100K (6% of total)\n\n3. Cash Flow\n- Operating cash flow: $550K (25% increase from Q1)\n- Accounts receivable days: 32 (down from 45 in Q1)\n- Cash reserves: $3.2M (sufficient for 6 months of operations)\n\nThe financial position of the company remains strong, with healthy growth in revenue and improved cash flow. The efficiency initiatives implemented in Q1 are showing positive results.',
    createdAt: new Date(Date.now() - FIVE_DAYS).toISOString(),
    recommendations: [
      'Continue to optimize accounts receivable processes',
      'Consider investing excess cash in short-term instruments',
      'Prepare for potential expansion in Q4',
      'Review pricing strategy for professional services to improve margins'
    ]
  },
  {
    id: '203',
    taskId: '106',
    content: 'Customer satisfaction survey results have been analyzed. Overall satisfaction score is 82/100, which is a 5-point improvement from the last survey. Key areas of improvement include product quality and customer support response times.\n\nKey findings:\n\n1. Overall Satisfaction\n- Overall score: 82/100 (up from 77/100)\n- Net Promoter Score (NPS): 42 (up from 35)\n- Customer Effort Score: 5.8/10 (improved from 6.5/10, lower is better)\n\n2. Product Satisfaction\n- Product quality: 85/100 (up from 78/100)\n- Ease of use: 79/100 (up from 75/100)\n- Feature completeness: 76/100 (up from 72/100)\n- Value for money: 80/100 (up from 76/100)\n\n3. Support Satisfaction\n- Response time: 84/100 (significant improvement from 70/100)\n- Issue resolution: 81/100 (up from 75/100)\n- Knowledge of support staff: 88/100 (consistent with previous survey)\n\n4. Common Feedback Themes\n- Positive: Improved product stability, faster customer support, intuitive interface\n- Negative: Limited integration options, mobile app performance, advanced reporting features\n\nThe survey results indicate that our recent initiatives to improve product quality and customer support have been successful. Customers particularly appreciate the faster response times and improved product stability.',
    createdAt: new Date(Date.now() - TWO_DAYS).toISOString(),
    recommendations: [
      'Implement additional quality control measures in production',
      'Expand customer support team to maintain improved response times',
      'Develop a customer loyalty program to reward repeat customers',
      'Prioritize mobile app performance improvements in the next development cycle',
      'Enhance integration capabilities with popular third-party tools'
    ]
  }
];

// Моковые стратегии C-Level
export const mockStrategies: Record<CLevelType, CLevelStrategy> = {
  'CEO': {
    clevelType: 'CEO',
    title: 'CEO Strategy 2025',
    description: 'This strategy outlines the key objectives and initiatives for achieving our business goals in the upcoming year. It focuses on overall company growth, market positioning, and organizational culture.',
    objectives: [
      'Achieve 25% year-over-year revenue growth',
      'Expand into two new international markets',
      'Strengthen company culture and employee satisfaction',
      'Secure Series B funding round'
    ],
    kpis: [
      'Revenue growth percentage',
      'Market share in new territories',
      'Employee satisfaction score',
      'Funding secured (amount and valuation)'
    ]
  },
  'COO': {
    clevelType: 'COO',
    title: 'COO Strategy 2025',
    description: 'This strategy outlines the key objectives and initiatives for operational excellence. It focuses on efficiency, scalability, and process optimization.',
    objectives: [
      'Increase operational efficiency by 15%',
      'Optimize supply chain and vendor relationships',
      'Implement new quality assurance processes',
      'Develop talent and leadership capabilities'
    ],
    kpis: [
      'Operational cost reduction percentage',
      'Supply chain delivery time reduction',
      'Product quality metrics improvement',
      'Internal promotion rate'
    ]
  },
  'CMO': {
    clevelType: 'CMO',
    title: 'CMO Strategy 2025',
    description: 'This strategy outlines the key objectives and initiatives for marketing success. It focuses on brand awareness, lead generation, and customer engagement.',
    objectives: [
      'Increase brand awareness by 30%',
      'Generate 20% more qualified leads',
      'Improve customer engagement metrics',
      'Launch two major marketing campaigns'
    ],
    kpis: [
      'Brand awareness metrics',
      'Lead generation volume and quality',
      'Customer engagement rates',
      'Marketing campaign ROI'
    ]
  },
  'CTO': {
    clevelType: 'CTO',
    title: 'CTO Strategy 2025',
    description: 'This strategy outlines the key objectives and initiatives for technological advancement. It focuses on innovation, system reliability, and technical debt reduction.',
    objectives: [
      'Launch two new product features',
      'Improve system uptime to 99.9%',
      'Reduce technical debt by 25%',
      'Implement enhanced security measures'
    ],
    kpis: [
      'Feature delivery timeline',
      'System uptime percentage',
      'Technical debt reduction metrics',
      'Security incident metrics'
    ]
  },
  'CFO': {
    clevelType: 'CFO',
    title: 'CFO Strategy 2025',
    description: 'This strategy outlines the key objectives and initiatives for financial health. It focuses on profitability, cash flow optimization, and investment strategy.',
    objectives: [
      'Improve profit margin by 10%',
      'Optimize cash flow management',
      'Develop investment strategy for excess cash',
      'Streamline financial reporting processes'
    ],
    kpis: [
      'Profit margin percentage',
      'Cash flow metrics',
      'Return on investments',
      'Financial reporting efficiency'
    ]
  },
  'CCO': {
    clevelType: 'CCO',
    title: 'CCO Strategy 2025',
    description: 'This strategy outlines the key objectives and initiatives for customer success. It focuses on customer satisfaction, retention, and expansion.',
    objectives: [
      'Improve customer satisfaction score by 15%',
      'Reduce customer churn by 10%',
      'Increase customer lifetime value',
      'Implement enhanced customer feedback system'
    ],
    kpis: [
      'Customer satisfaction score',
      'Customer churn rate',
      'Customer lifetime value metrics',
      'Customer feedback volume and sentiment'
    ]
  },
  'CHRO': {
    clevelType: 'CHRO',
    title: 'CHRO Strategy 2025',
    description: 'This strategy outlines the key objectives and initiatives for human resources excellence. It focuses on talent acquisition, employee development, and organizational culture.',
    objectives: [
      'Improve employee satisfaction by 20%',
      'Reduce employee turnover by 15%',
      'Implement comprehensive leadership development program',
      'Enhance diversity and inclusion initiatives'
    ],
    kpis: [
      'Employee satisfaction score',
      'Employee turnover rate',
      'Leadership program participation and effectiveness',
      'Diversity and inclusion metrics'
    ]
  }
};
