export interface Assignment {
  id: string;
  name: string;
  repo: string;
  submitted: number;
  total: number;
  dueDate: string;
  status: 'reviewing' | 'complete' | 'draft' | 'scheduled';
  language: string;
  avgScore: number | null;
  lastRun: string;
}

export interface Intern {
  id: string;
  name: string;
  handle: string;
  score: number;
  critical: number;
  major: number;
  minor: number;
  status: 'passed' | 'review' | 'flagged';
  runStatus: 'done' | 'running' | 'queued';
  time: string;
  pr: number;
  commits: number;
  submittedAt: string;
}

export interface Finding {
  id: string;
  severity: 'critical' | 'major' | 'minor';
  title: string;
  file: string;
  body: string;
  code?: string;
}

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn-1201',
    name: 'Week 4 — Rate-Limited API Client',
    repo: 'cohort-s26/week-04-ratelimiter',
    submitted: 54,
    total: 58,
    dueDate: 'Apr 20',
    status: 'reviewing',
    language: 'TypeScript',
    avgScore: 78,
    lastRun: '2h ago',
  },
  {
    id: 'asgn-1198',
    name: 'Week 3 — Auth Flow with JWT',
    repo: 'cohort-s26/week-03-auth',
    submitted: 57,
    total: 58,
    dueDate: 'Apr 13',
    status: 'complete',
    language: 'TypeScript',
    avgScore: 82,
    lastRun: '6d ago',
  },
  {
    id: 'asgn-1194',
    name: 'Week 2 — React Data Table',
    repo: 'cohort-s26/week-02-table',
    submitted: 58,
    total: 58,
    dueDate: 'Apr 06',
    status: 'complete',
    language: 'React / TS',
    avgScore: 85,
    lastRun: '13d ago',
  },
  {
    id: 'asgn-1187',
    name: 'Week 1 — HTTP from scratch',
    repo: 'cohort-s26/week-01-http',
    submitted: 58,
    total: 58,
    dueDate: 'Mar 30',
    status: 'complete',
    language: 'Go',
    avgScore: 74,
    lastRun: '20d ago',
  },
  {
    id: 'asgn-1210',
    name: 'Capstone — Mini Kubernetes Scheduler',
    repo: 'cohort-s26/capstone',
    submitted: 12,
    total: 58,
    dueDate: 'May 14',
    status: 'draft',
    language: 'Go',
    avgScore: null,
    lastRun: '—',
  },
  {
    id: 'asgn-1205',
    name: 'Week 5 — SQL Query Optimizer',
    repo: 'cohort-s26/week-05-sql',
    submitted: 0,
    total: 58,
    dueDate: 'Apr 27',
    status: 'scheduled',
    language: 'PostgreSQL',
    avgScore: null,
    lastRun: '—',
  },
];

const FIRST_NAMES = ['Aarav','Priya','Mei','Daniel','Zara','Luca','Anaya','Kenji','Sofia','Noah','Ravi','Emma','Ibrahim','Ji-woo','Marcus','Amara','Elena','Rohan','Chen','Leila','Arjun','Nadia','Tomas','Keisha','Hiro','Maya','Diego','Fatima','Oscar','Yuki','Ayaan','Lena','Ethan','Nisha','Jonas','Adaeze','Kiran','Isla','Farah','Sam','Vihaan','Zuri','Rafael','Mira','Ben','Anika','Noor','Theo','Divya','Lukas','Eva','Hassan','Priyanka','Nate','Saanvi','Mateo','Vera','Owen','Lara'];
const LAST_NAMES = ['Patel','Zhang','Okafor','Silva','Cohen','Müller','Rossi','Tanaka','García','Singh','Kim','Hassan','Novak','Reddy','Nakamura','Adebayo','Ortega','Fischer','Wang','Johansson','Shah','Chen','Morales','Iwu','Brandt','Petrov','Osei','Kumar','Jensen','Ng'];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildInterns(seed = 42, count = 54): Intern[] {
  const rng = mulberry32(seed);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
  const out: Intern[] = [];
  for (let i = 0; i < count; i++) {
    const f = pick(FIRST_NAMES);
    const l = pick(LAST_NAMES);
    const handle = '@' + (f[0] + l).toLowerCase().replace(/[^a-z]/g, '') + String(10 + Math.floor(rng() * 90));
    let base = 50 + rng() * 45;
    if (rng() > 0.85) base = 30 + rng() * 25;
    const score = Math.round(base);
    const critical = score < 55 ? 1 + Math.floor(rng() * 3) : score < 70 ? Math.floor(rng() * 2) : 0;
    const major = Math.floor(rng() * 4) + (score < 60 ? 2 : 0);
    const minor = 2 + Math.floor(rng() * 6);
    const status: Intern['status'] = score >= 80 ? 'passed' : score >= 60 ? 'review' : 'flagged';
    const runStatus: Intern['runStatus'] = rng() > 0.96 ? 'running' : rng() > 0.98 ? 'queued' : 'done';
    out.push({
      id: `intern-${1000 + i}`,
      name: `${f} ${l}`,
      handle,
      score,
      critical,
      major,
      minor,
      status,
      runStatus,
      time: `${1 + Math.floor(rng() * 5)}.${Math.floor(rng() * 9)}s`,
      pr: 400 + Math.floor(rng() * 300),
      commits: 4 + Math.floor(rng() * 12),
      submittedAt: `Apr ${15 + Math.floor(rng() * 5)}`,
    });
  }
  return out.sort((a, b) => b.score - a.score);
}

export const INTERNS = buildInterns(7, 54);

export const DEFAULT_PROMPT = `You are a senior staff engineer reviewing a junior's submission.

Focus areas:
1. Correctness — does the rate limiter actually enforce the contract under concurrent load?
2. Edge cases — what happens at the exact limit, on clock skew, or when the store is unavailable?
3. Code quality — naming, module boundaries, error handling, logging.
4. Testing — are tests meaningful, or do they just satisfy coverage?

For each issue, output:
- Severity: critical | major | minor
- File + line range
- Concrete suggested fix (show the diff, not just prose)
- One-line rationale tied to a principle (not opinion)

Be direct. Do not hedge. If the submission is solid, say so in one line and stop.`;

export const FINDINGS_SAMPLE: Finding[] = [
  {
    id: 'f1',
    severity: 'critical',
    title: 'Race condition in token bucket refill',
    file: 'src/limiter/bucket.ts:47–63',
    body: 'The refill calculation reads `lastRefill` and writes `tokens` without a lock. Under concurrent `take()` calls, two callers can each see the same stale `lastRefill`, both add the same delta, and double-credit the bucket. This silently breaks the rate guarantee under load.',
    code: `<span class="del"><span class="ln">47</span>- refill() {
</span><span class="del"><span class="ln">48</span>-   const now = Date.now();
</span><span class="del"><span class="ln">49</span>-   const delta = (now - this.lastRefill) * this.rate;
</span><span class="del"><span class="ln">50</span>-   this.tokens = Math.min(this.cap, this.tokens + delta);
</span><span class="del"><span class="ln">51</span>-   this.lastRefill = now;
</span><span class="del"><span class="ln">52</span>- }
</span><span class="add"><span class="ln">47</span>+ async refill() {
</span><span class="add"><span class="ln">48</span>+   return this.mutex.runExclusive(() =&gt; {
</span><span class="add"><span class="ln">49</span>+     const now = Date.now();
</span><span class="add"><span class="ln">50</span>+     const delta = (now - this.lastRefill) * this.rate;
</span><span class="add"><span class="ln">51</span>+     this.tokens = Math.min(this.cap, this.tokens + delta);
</span><span class="add"><span class="ln">52</span>+     this.lastRefill = now;
</span><span class="add"><span class="ln">53</span>+   });
</span><span class="add"><span class="ln">54</span>+ }</span>`,
  },
  {
    id: 'f2',
    severity: 'major',
    title: 'Missing backoff on Redis connection failure',
    file: 'src/store/redis.ts:12–18',
    body: '`connect()` is called once at construction. If Redis is briefly unreachable at startup, the process exits with an unhandled rejection instead of retrying. Production limiters should degrade gracefully to a local fallback or back off with jitter.',
  },
  {
    id: 'f3',
    severity: 'major',
    title: 'Unbounded queue in `waitForToken`',
    file: 'src/limiter/queue.ts:22',
    body: 'Callers waiting for tokens are pushed into an array with no cap. A burst can exhaust memory. Cap at a configurable `maxPending` and reject with `429` once full.',
  },
  {
    id: 'f4',
    severity: 'minor',
    title: 'Public API uses `any` for options',
    file: 'src/index.ts:4',
    body: 'The exported factory takes `options: any`. Define a `LimiterOptions` interface so consumers get autocompletion and compile-time checks.',
  },
  {
    id: 'f5',
    severity: 'minor',
    title: 'Tests assert elapsed time with `toBe`',
    file: 'tests/limiter.test.ts:88',
    body: 'Time-based assertions are flaky on CI. Use `toBeGreaterThanOrEqual` with a small lower bound and an upper bound that allows for scheduler jitter.',
  },
];
