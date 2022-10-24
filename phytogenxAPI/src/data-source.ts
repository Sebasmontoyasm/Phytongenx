import "reflect-metadata"
import { DataSource } from "typeorm"
import { Data } from "./entity/masterdata"
import { Restore } from "./entity/Restore"
import { User } from "./entity/User"
import { Userlog } from "./entity/Userlog"
import { Labresults } from "./entity/Labresults"
import { observablepedro } from "./entity/observablepedro"
import { Invoices } from "./entity/Invoices"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "SS",
    password: "123456",
    database: "pgenx-cmsqb",
    synchronize: true,
    logging: false,
    entities: [User,Data,Userlog,Restore,Labresults,observablepedro,Invoices],
    migrations: [],
    subscribers: [],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Base de datos conectada");
    })
    .catch((error) => {
        console.log("ERROR DB CONNECTION: ",error)
    })