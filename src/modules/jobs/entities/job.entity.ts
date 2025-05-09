import { JobType } from "src/common/enums/jobType.enum";
import { BaseEntity } from "src/lib/Base.entity";
import { Application } from "src/modules/applications/entities/application.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Job extends BaseEntity {

    @Column({ name: 'title', type: 'varchar', length: 150, nullable: false })
    title: string;

    @Column({ name: 'description', type: 'text', nullable: false })
    description: string;

    @Column({ name: 'requirements', type: 'text', nullable: true })
    requirements?: string;

    @Column({ name: 'location', type: 'varchar', length: 150, nullable: false })
    location: string;

    @Column({ name: 'salary', type: 'varchar', length: 150, nullable: false })
    salary: string;

    @Column({ name: 'job_type', type: 'enum', enum: JobType, nullable: false })
    jobType: JobType;

    @Column({ name: 'work_field', type: 'varchar', length: 150, nullable: false })
    category: string;

    @Column({ name: 'company_name', type: 'varchar', length: 150, nullable: false })
    companyName: string;

    @Column({ name: 'is_job_open', type: 'boolean', nullable: false })
    isActive: boolean;

    @Column({ name: 'posted_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    postedAt: Date;

    @OneToMany(() => Application, (application) => application.job)
    applications: Application[];

    @ManyToOne(() => User, (user) => user.postedJobs)
    recruiter: User;
}
