import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../../lib/Base.entity";
import { RoleEnum } from "src/common/enums/roleEnum";
import { Application } from "src/modules/applications/entities/application.entity";
import { Job } from "src/modules/jobs/entities/job.entity";

@Entity()
export class User extends BaseEntity {

    // General info
    @Column({ name: 'full_name', type: 'varchar', length: 150, nullable: false })
    fullName: string;

    @Column({ name: 'email', type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ name: 'password', type: 'varchar', length: 100, nullable: false })
    password: string;

    @Column({ name: 'role', type: 'enum', enum: RoleEnum, default: RoleEnum.JOB_SEEKER, nullable: false })
    role: RoleEnum;

    @Column({ name: 'profile_image', type: 'varchar', nullable: true })
    profileImage: string;

    @Column({ name: 'bio', type: 'varchar', length: 400, nullable: true })
    bio: string;

    @Column({ name: 'phone', type: 'varchar', length: 30, nullable: true })
    phone: string;

    @Column({ name: 'location', type: 'varchar', nullable: true })
    location: string;

    @Column({ name: 'is_email_verified', default: false })
    isEmailVerified: boolean;

    @Column({ name: 'register_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    registerDate: Date;


    @Column({ type: 'text', nullable: true })
    refreshToken: string | null


    // Recruiter related info
    @Column({ name: 'company_name', type: 'varchar', length: 150, nullable: true })
    companyName: string;

    @Column({ name: 'company_website', type: 'varchar', length: 200, nullable: true })
    companyWebsite: string;

    @Column({ name: 'company_description', type: 'text', nullable: true })
    companyDescription: string;

    @Column({ name: 'company_logo', type: 'varchar', nullable: true })
    companyLogo: string;

    @Column({ name: 'industry_type', type: 'varchar', length: 100, nullable: true })
    industryType: string;


    // Job seeker: One user → Many applications
    @OneToMany(() => Application, (application) => application.applicant)
    applications: Application[]

    // Recruiter: One recruiter → Many jobs
    @OneToMany(() => Job, (job) => job.recruiter)
    postedJobs: Job[]
}
