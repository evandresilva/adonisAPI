import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Model from 'App/Models/Moment'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'
import Moment from 'App/Models/Moment'

export default class MomentsController {
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }
  public async store({ request, response }: HttpContextContract) {
    const body = request.body()
    const image = request.file('image', this.validationOptions)
    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`
      await image.move(Application.tmpPath('uploads'), { name: imageName })
      body.image = imageName
    }

    const moment = await Model.create(body)

    response.status(201)
    return {
      message: 'Seu momento foi criado com sucesso',
      data: moment,
    }
  }
  public async index() {
    const moments = await Moment.all()
    return { data: moments }
  }
  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    return {
      data: moment,
    }
  }
}
