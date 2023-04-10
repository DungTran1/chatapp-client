import { useEffect } from "react";

interface TitleProps {
  value: string;
}
const Title: React.FC<TitleProps> = ({ value }) => {
  useEffect(() => {
    document.title = value;
  }, [value]);
  return <></>;
};
export default Title;
