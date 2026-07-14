// ============================================
// words.js — Developer-themed word dictionary
// ============================================

const WORD_DICTIONARY = {
  easy: [
    'HTML', 'CSS', 'Git', 'npm', 'API', 'SQL', 'CLI', 'DOM', 'URL', 'SSH',
    'Vue', 'AWS', 'GCP', 'PHP', 'Vim', 'Bash', 'Rust', 'Go', 'Java', 'Ruby',
    'Sass', 'Less', 'YAML', 'JSON', 'XML', 'REST', 'SDK', 'IDE', 'OOP', 'MVC'
  ],
  medium: [
    'React', 'Redux', 'Kafka', 'Redis', 'MySQL', 'Azure', 'Docker', 'Flask',
    'Django', 'Swift', 'Kotlin', 'NodeJS', 'Figma', 'Linux', 'Nginx', 'OAuth',
    'GitHub', 'GitLab', 'Heroku', 'Vercel', 'Svelte', 'Deno', 'Remix', 'Next',
    'Nuxt', 'Ember', 'Elixir', 'Scala', 'Perl', 'Proxy', 'Cache', 'Debug',
    'Mapbox', 'Webpack', 'Parcel', 'Rollup', 'Prisma', 'Drizzle'
  ],
  hard: [
    'JavaScript', 'TypeScript', 'Angular', 'MongoDB', 'PostgreSQL',
    'Kubernetes', 'Terraform', 'Jenkins', 'GraphQL', 'Datadog',
    'SpringBoot', 'Microservice', 'RabbitMQ', 'Algorithms', 'BinaryTree',
    'Recursion', 'Optimization', 'Authentication', 'Authorization',
    'Caching', 'Observability', 'EventDriven', 'Middleware', 'WebSocket',
    'Serverless', 'Blockchain', 'Encryption', 'Dependency', 'Refactoring',
    'Deployment', 'Containerize', 'Abstraction', 'Polymorphism',
    'Inheritance', 'Encapsulation', 'Concurrency', 'Serialization'
  ]
};

/**
 * Returns a random word based on difficulty level.
 * Higher levels pull from harder word pools.
 */
function getRandomWord(level) {
  let pool;
  if (level <= 2) {
    pool = [...WORD_DICTIONARY.easy, ...WORD_DICTIONARY.medium.slice(0, 10)];
  } else if (level <= 4) {
    pool = [...WORD_DICTIONARY.easy, ...WORD_DICTIONARY.medium, ...WORD_DICTIONARY.hard.slice(0, 10)];
  } else {
    pool = [...WORD_DICTIONARY.easy, ...WORD_DICTIONARY.medium, ...WORD_DICTIONARY.hard];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
