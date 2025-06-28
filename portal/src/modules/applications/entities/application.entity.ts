import { ApplicationStatusEnum } from "src/common/enums/application-status";
import { BaseEntity } from "src/lib/Base.entity";
import { Job } from "src/modules/jobs/entities/job.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Application extends BaseEntity {    // Ariza



    @Column({ name: 'resume_url', type: 'varchar', nullable: true })
    resume: string | undefined;


    @Column({ name: 'cover_letter_en', nullable: true })
    coverLetterEn: string;

    @Column({ name: 'cover_letter_ru', nullable: true })
    coverLetterRu: string;

    @Column({ name: 'cover_letter+_uz', nullable: true })
    coverLetterUz: string;



    @Column({
        type: 'enum',
        enum: ApplicationStatusEnum,
        default: ApplicationStatusEnum.PENDING,
    })
    status: ApplicationStatusEnum;


    // All applications submitted to this job
    @ManyToOne(() => Job, (job) => job.applications)
    job: Job;

    // The recruiter (User) who posted the job
    @ManyToOne(() => User, (user) => user.applications)
    @JoinColumn({ name: 'applicant_id' })
    applicant: User;
}
