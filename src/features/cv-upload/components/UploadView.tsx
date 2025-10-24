import { Form } from "react-router-dom";

export default function UploadView() {
  return (
    <div>
      <p>
        Upload a JSON file with your CV data. The structure should match the
        required format.
      </p>
      {/* <Form method="post" action="/upload-cv"> */}
      {/* {cvData && (
          <>
            <input type="hidden" name="cvData" value={cvData} />
            <button type="submit" className={styles.submitButton}>
              Process CV File
            </button>
          </>
        )} */}
      {/* </Form> */}
    </div>
  );
}
