import { loggerService, megaverseService } from './src/services'

const app = async (): Promise<void> => {
  try {
    const goalMap = await megaverseService.getGoalMap()
    await megaverseService.sendMap(goalMap)
    loggerService.info('Megaverse created successfully!')
  } catch (err) {
    loggerService.error(`Program failed. Reason: ${err.message ?? err}`)
  }
}

void app()
