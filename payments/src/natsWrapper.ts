import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client(){
    if(!this._client){
      throw new Error("Client is connected");
    }

    return this._client
  }

  connect(
    clusterId: string,
    clientId: string,
    urlString: string 
  ) {
    this._client = nats.connect(clusterId, clientId, {
      url: urlString
    });

    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to Nats");
        resolve("Connected");
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
