import { zUserCv } from "@api/career-service/zod.gen";
import { useCvData } from "@shared/hooks/useCvData";
import { useCallback, useState } from "react";
import type { FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { Form } from "react-router-dom";
import styles from "./UploadView.module.scss";

export default function UploadView() {
  const [cvDataString, setCvDataString] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { updateCvData } = useCvData();

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setErrorMessage(null);
      setCvDataString(null);
      setFileName(null);

      const file = acceptedFiles[0];
      if (!file) {
        return;
      }

      setIsParsing(true);

      try {
        const fileContents = await file.text();
        const parsedJson = JSON.parse(fileContents);
        const validationResult = zUserCv.safeParse(parsedJson);

        if (!validationResult.success) {
          setErrorMessage("Plik JSON nie pasuje do wymaganego formatu CV.");
          console.error("CV JSON validation failed:", validationResult.error);
          return;
        }

        const normalizedData = validationResult.data;
        updateCvData(normalizedData);
        setCvDataString(JSON.stringify(normalizedData));
        setFileName(file.name);
      } catch (error) {
        setErrorMessage(
          "Nie udało się odczytać pliku. Upewnij się, że to poprawny JSON.",
        );
        console.error("Error while reading CV JSON:", error);
      } finally {
        setIsParsing(false);
      }
    },
    [updateCvData],
  );

  const handleDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (!fileRejections.length) {
      return;
    }

    const rejection = fileRejections[0];
    const hasInvalidType = rejection.errors.some(
      (error) => error.code === "file-invalid-type",
    );
    const hasTooManyFiles = rejection.errors.some(
      (error) => error.code === "too-many-files",
    );

    if (hasInvalidType) {
      setErrorMessage("Obsługujemy tylko pliki z rozszerzeniem .json.");
    } else if (hasTooManyFiles) {
      setErrorMessage("Możesz przesłać tylko jeden plik naraz.");
    } else {
      setErrorMessage("Nie udało się przyjąć pliku. Spróbuj ponownie.");
    }
    setCvDataString(null);
    setFileName(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    accept: { "application/json": [".json"] },
    multiple: false,
    maxFiles: 1,
  });

  const dropzoneClassName = [
    styles.dropzone,
    isDragActive ? styles.dropzoneActive : "",
    errorMessage ? styles.dropzoneError : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Form method="post" action="/upload-cv" className={styles.uploadView}>
      <div {...getRootProps({ className: dropzoneClassName })}>
        <input {...getInputProps()} />
        <p className={styles.instructions}>
          Przeciągnij i upuść plik CV w formacie JSON lub kliknij, aby wybrać z
          dysku.
        </p>
        <p className={styles.supportText}>
          Wymagany jest plik zgodny ze strukturą eksportu CV w aplikacji.
        </p>
      </div>

      {isParsing && (
        <p className={styles.statusMessage}>Sprawdzam strukturę pliku…</p>
      )}

      {errorMessage && (
        <p className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      )}

      {fileName && cvDataString && (
        <div className={styles.fileInfo}>
          <strong>Wybrany plik:</strong>
          <span>{fileName}</span>
        </div>
      )}

      {cvDataString && (
        <>
          <input type="hidden" name="cvData" value={cvDataString} />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isParsing}
          >
            Przetwarzaj CV
          </button>
        </>
      )}
    </Form>
  );
}
