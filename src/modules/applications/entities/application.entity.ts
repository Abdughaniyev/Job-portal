import { ApplicationStatusEnum } from "src/common/enums/application-status";
import { BaseEntity } from "src/lib/Base.entity";
import { Job } from "src/modules/jobs/entities/job.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Application extends BaseEntity {    // Ariza



    @Column({ name: 'resume_url', nullable: true })
    resumeUrl: string;

    @Column({ name: 'cover_letter', nullable: false })
    coverLetter: string;

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
    @JoinColumn({name:'applicant_id'})
    applicant: User;
}
