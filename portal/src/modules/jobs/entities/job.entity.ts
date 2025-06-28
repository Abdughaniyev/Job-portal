import { JobType } from "src/common/enums/jobType.enum";
import { BaseEntity } from "src/lib/Base.entity";
import { Application } from "src/modules/applications/entities/application.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Job extends BaseEntity {


    @Column({ name: 'title_en', type: 'varchar', length: 150, nullable: true })
    titleEn?: string;

    @Column({ name: 'title_ru', type: 'varchar', length: 150, nullable: true })
    titleRu?: string;

    @Column({ name: 'title_uz', type: 'varchar', length: 150, nullable: true })
    titleUz?: string;



    @Column({ name: 'description_en', type: 'text', nullable: true })
    descriptionEn?: string;

    @Column({ name: 'description_ru', type: 'text', nullable: true })
    descriptionRu?: string;

    @Column({ name: 'description_uz', type: 'text', nullable: true })
    descriptionUz?: string;



    @Column({ name: 'requirements_en', type: 'text', nullable: true })
    requirementsEn?: string;

    @Column({ name: 'requirements_ru', type: 'text', nullable: true })
    requirementsRu?: string;

    @Column({ name: 'requirements_uz', type: 'text', nullable: true })
    requirementsUz?: string;



    @Column({ name: 'location_en', type: 'varchar', length: 150, nullable: true })
    locationEn?: string;

    @Column({ name: 'location_ru', type: 'varchar', length: 150, nullable: true })
    locationRu?: string;

    @Column({ name: 'location_uz', type: 'varchar', length: 150, nullable: true })
    locationUz?: string;



    @Column({ name: 'salary', type: 'varchar', length: 150, nullable: true })
    salary?: string;

    // Compare Job dto and Entity have the same translations

    @Column({ name: 'job_type', type: 'enum', enum: JobType, nullable: false })
    jobType: JobType;

    @Column({ name: 'job_category', type: 'varchar', length: 150, nullable: false })
    jobCategory: string;

    @Column({ name: 'company_name', type: 'varchar', length: 150, nullable: false })
    companyName: string;

    @Column({ name: 'posted_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    postedAt: Date;

    @OneToMany(() => Application, (application) => application.job)
    applications: Application[];

    @ManyToOne(() => User, (user) => user.postedJobs)
    @JoinColumn({ name: 'recruiter_id' })
    recruiter: User;


}
