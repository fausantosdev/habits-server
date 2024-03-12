import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import dayjs from 'dayjs'

import { prisma } from './lib/prisma'

export async function appRoutes (app: FastifyInstance) {
    app.post('/habits', async (request) => {
        const bodySchema = z.object({
            title: z.string(),
            habitWeekDays: z.array(
                z.number().min(0).max(6)
            )
        })

        const { title, habitWeekDays } = bodySchema.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        const habits = await prisma.habit.create({
            data: {
                title,
                habitWeekDays: {
                    create: habitWeekDays.map( weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                },
                created_at: today
            }
        })
    
        return habits
    })

    app.get('/habits', async (request) => {
        /*await prisma.habit.deleteMany()
        return*/
        const bodySchema = z.object({
            date: z.coerce.date()
        })
    
        const { date } = bodySchema.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = dayjs(parsedDate).get('day')

        // todos os hábitos possíveis
        // hábitos que já foram completados
        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                habitWeekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })
        
        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        })

        return {
            possibleHabits,
            completedHabits
        }
    })

    // Marcar ou desmarcar hábitos
    // Não completa hábitos retroativos
    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabbitParams = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabbitParams.parse(request.params)
    
        const today = dayjs().startOf('day').toDate()

        // Procura o dia
        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        // Se o dia não foi encontrado, cria um
        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        // Procura o hábito pelo id do dia e id do hábito, ou seja, se já foi completo
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        // Remover o dia
        if(dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
        // Cria o dia
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            }) 
        }
    })

    app.get('/summary', async (request) => {
        const summary = await prisma.$queryRaw`
            SELECT d.id, d.date,
            ( 
                SELECT cast(count(*) as float) 
                    FROM day_habits dh 
                    WHERE dh.day_id = d.id 
            ) as completed,
            ( 
                SELECT cast(count(*) as float) 
                    FROM habit_week_days hwd 
                    JOIN habits h ON h.id = hwd.habit_id
                    WHERE hwd.week_day = EXTRACT(DOW FROM d.date)
                    AND h.created_at <= d.date
            ) as ammount
            FROM days d
        `
        return summary
    })
}
// SQLITE:     strftime('%w', d.date/1000.0, 'unixepoch')
// MySQL:      DAYOFWEEK(d.date)
// PostgreSQL: EXTRACT(DOW FROM date_column)