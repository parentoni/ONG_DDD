import { getGlobal } from "../data/config";
import { Either, left, right } from "../shared/Result";

export class Api {
  protected static baseUrl = getGlobal('apiUrl')
  public static async get (url: string, token?:string): Promise<Either<Response, any>> {
    const response = await fetch(this.baseUrl + url, {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + token
      }
    })

    const json = await response.json()
    if (response.ok) {
      return right(json)
    }

    return left(response)
  }

  public static async post (url: string, body: any, token?:string): Promise<Either<Response, any>> {
    const response = await fetch(this.baseUrl + url, {
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-type": "application/json",
        "Accept": "application/json"
      },
      body: body
    })

    const json = await response.json()
    if (response.ok) {
      return right(json)
    }

    return left(response)
  }
}