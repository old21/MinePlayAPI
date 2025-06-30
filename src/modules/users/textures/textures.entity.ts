import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Texture } from './textures.types';

@Entity("textures_library")
export class Textures {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    /**
     * TEXTURETYPES: 0 - SKIN
     *               1 - CLOAK
     *               2 - BANNER
     *               3 - AVATAR
     */
    @Column({ type: "integer" })
    textureType: number;

    @Column({ type: "varchar" })
    name: string;

    texture: Texture;

    @Column({ type: "varchar", nullable: true })
    params: string;
}