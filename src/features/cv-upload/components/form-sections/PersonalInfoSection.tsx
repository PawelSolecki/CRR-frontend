import { zUserCv } from "@api/career-service/zod.gen";
import Input from "@shared/components/Input/Input";
import type { UseFormRegister } from "react-hook-form";
import { z } from "zod";
import styles from "./FormSections.module.scss";

type UserCvForm = z.infer<typeof zUserCv>;

interface PersonalInfoSectionProps {
  register: UseFormRegister<UserCvForm>;
  errors: any;
}

export default function PersonalInfoSection({
  register,
  errors,
}: PersonalInfoSectionProps) {
  return (
    <div className={styles.formSection}>
      <div className={styles.formRow}>
        <Input
          label="First Name *"
          id="firstName"
          {...register("personalInfo.firstName")}
          error={errors.personalInfo?.firstName?.message}
        />
        <Input
          label="Last Name *"
          id="lastName"
          {...register("personalInfo.lastName")}
          error={errors.personalInfo?.lastName?.message}
        />
      </div>
      <div className={styles.formRow}>
        <Input
          label="Email"
          id="email"
          type="email"
          {...register("personalInfo.email")}
          error={errors.personalInfo?.email?.message}
        />
        <Input
          label="Phone"
          id="phone"
          type="tel"
          {...register("personalInfo.phone")}
          error={errors.personalInfo?.phone?.message}
        />
      </div>
      <div className={styles.formRow}>
        <Input
          label="Role"
          id="role"
          {...register("personalInfo.role")}
          error={errors.personalInfo?.role?.message}
        />
        <Input
          label="LinkedIn"
          id="linkedIn"
          type="url"
          {...register("personalInfo.linkedIn")}
          error={errors.personalInfo?.linkedIn?.message}
        />
      </div>
      <div className={styles.formRow}>
        <Input
          label="GitHub"
          id="github"
          type="url"
          {...register("personalInfo.github")}
          error={errors.personalInfo?.github?.message}
        />
        <Input
          label="Website"
          id="website"
          type="url"
          {...register("personalInfo.website")}
          error={errors.personalInfo?.website?.message}
        />
      </div>
    </div>
  );
}
