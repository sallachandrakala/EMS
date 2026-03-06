import { execSync } from 'node:child_process'
import { platform } from 'node:os'

const port = Number(process.env.PORT) || 5000

try {
  if (platform() === 'win32') {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    const lines = out.trim().split(/\r?\n/).filter((l) => l.includes('LISTENING'))
    const pids = [...new Set(lines.map((l) => l.trim().split(/\s+/).pop()).filter(Boolean))]
    for (const pid of pids) {
      execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' })
      console.log(`Freed port ${port} (PID ${pid})`)
    }
    if (pids.length === 0) console.log(`Port ${port} was not in use`)
  } else {
    execSync(`lsof -ti:${port} | xargs -r kill -9`, { stdio: 'ignore' })
    console.log(`Freed port ${port}`)
  }
} catch (e) {
  console.log(`Port ${port} was not in use or could not be freed`)
}
