import Button from "../../../components/ui/Button/Button";
import classes from "./FormNavigation.module.scss";

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  nextText?: string;
  backText?: string;
  isLoading?: boolean;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  nextButtonType?: "button" | "submit";
  className?: string;
}

export default function FormNavigation({
  onBack,
  onNext,
  nextText = "Next",
  backText = "Back",
  isLoading = false,
  nextDisabled = false,
  backDisabled = false,
  nextButtonType = "button",
  className,
}: FormNavigationProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className={`${classes.navigation} ${className || ""}`}>
      <Button
        type="secondary"
        onClick={handleBack}
        disabled={isLoading || backDisabled}
      >
        {backText}
      </Button>
      <Button
        type="primary"
        buttonType={nextButtonType}
        onClick={onNext}
        disabled={isLoading || nextDisabled}
      >
        {nextText}
      </Button>
    </div>
  );
}
