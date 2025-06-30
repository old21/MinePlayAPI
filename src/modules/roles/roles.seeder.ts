// import { Injectable } from "@nestjs/common";
// import { Repository } from 'typeorm';
// import { Roles } from "./roles.entity";
// import { Seeder, DataFactory } from "nestjs-seeder";
// import { InjectRepository } from "@nestjs/typeorm";

// @Injectable()
// export class RolesSeeder implements Seeder {
//   constructor(@InjectRepository(Roles) private roleRepository: Repository<Roles>) {}

//   async seed(): Promise<any> {
//     // Generate 10 users.
//     const defaultRole = DataFactory.createForClass(Roles).generate(10);

//     // Insert into the database.
//     return this.roleRepository.insertMany(users);
//   }

//   async drop(): Promise<any> {
//     return this.roleRepository.deleteMany({});
//   }
// }