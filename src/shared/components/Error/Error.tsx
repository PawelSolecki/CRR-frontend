import classes from "./Error.module.scss";

export default function Error({ message }: { message: string }) {
  return (
    <div className={classes.error} data-testid="error">
      {message}
    </div>
  );
}
