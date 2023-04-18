import { useEffect } from "react";

type TitleProps = {
  value: string;
};
const Title: React.FC<TitleProps> = ({ value }) => {
  useEffect(() => {
    document.title = value;
  }, [value]);
  return <></>;
};
export default Title;
