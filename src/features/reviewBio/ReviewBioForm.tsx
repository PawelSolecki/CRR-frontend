import { FormNavigation } from "@features/navigation";
import { useState } from "react";
import { Form, useNavigation } from "react-router-dom";
import classes from "./ReviewBioForm.module.scss";

interface ReviewBioFormProps {
  generatedBio: string;
}

export default function ReviewBioForm({ generatedBio }: ReviewBioFormProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const [bio, setBio] = useState(generatedBio || "");
  const [charCount, setCharCount] = useState(generatedBio?.length || 0);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setBio(newText);
    setCharCount(newText.length);
  };

  return (
    <Form method="post">
      <input type="hidden" name="enhancedBio" value={bio} />

      <div className={classes.bioSection}>
        <div className={classes.bioContainer}>
          <div className={classes.sectionHeader}>
            <h2 className={classes.sectionTitle}>Professional Summary</h2>
          </div>

          <div className={classes.textareaWrapper}>
            <textarea
              className={classes.bioTextarea}
              value={bio}
              onChange={handleBioChange}
              placeholder="Your professional summary will appear here..."
              rows={8}
              disabled={isLoading}
            />
            <div className={classes.charCounter}>
              Character count: {charCount}
              {charCount > 500 && (
                <span className={classes.warning}>
                  {" "}
                  (Consider shortening for better readability)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <FormNavigation
        nextButtonType="submit"
        nextText={isLoading ? "Processing..." : "Next"}
        isLoading={isLoading}
        nextDisabled={isLoading || !bio.trim()}
      />
    </Form>
  );
}
