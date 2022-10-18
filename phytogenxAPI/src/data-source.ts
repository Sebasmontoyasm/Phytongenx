import "reflect-metadata"
import { DataSource } from "typeorm"
import { Data } from "./entity/masterdata"
import { Restore } from "./entity/Restore"
import { User } from "./entity/User"
import { Userlog } from "./entity/Userlog"
import { LabResults } from "./entity/LabResults"
import { observablepedro } from "./entity/observablepedro"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "SS",
    password: "1234",
    database: "pgenx-cmsqb",
    synchronize: true,
    logging: false,
    entities: [User,Data,Userlog,Restore,LabResults,observablepedro],
    migrations: [],
    subscribers: [],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Base de datos conectada");
    })
    .catch((error) => console.log(error))
