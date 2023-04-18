import React, { Fragment, useMemo, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Reaction, User } from "../../../../shared/type";
import { getReactionEmoji } from "../../../../shared/utils";
import { useAppSelector } from "../../../../store/hook";
import Overlay from "../../../Common/Overlay/Overlay";
import classnames from "classnames/bind";
import styles from "./UserReaction.module.scss";
const cx = classnames.bind(styles);
type DetailUserReactProps = {
  data: Reaction[] | undefined;
  setIsShowUserReaction: React.Dispatch<React.SetStateAction<boolean>>;
};
const DetailUserReact: React.FC<DetailUserReactProps> = ({
  data,
  setIsShowUserReaction,
}) => {
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  const [tab, setTab] = useState("all");

  const reactions = useMemo(() => {
    const userReactions: {
      [key: string]: { icon: string; userReact: User[] };
    } = {
      like: {
        icon: getReactionEmoji("like"),
        userReact: [],
      },
      love: {
        icon: getReactionEmoji("love"),
        userReact: [],
      },
      wow: {
        icon: getReactionEmoji("wow"),
        userReact: [],
      },
      care: {
        icon: getReactionEmoji("care"),
        userReact: [],
      },
      haha: {
        icon: getReactionEmoji("haha"),
        userReact: [],
      },
      angry: {
        icon: getReactionEmoji("angry"),
        userReact: [],
      },
      sad: {
        icon: getReactionEmoji("sad"),
        userReact: [],
      },
    };
    const fillReaction = (key: string, user: User) => {
      const keyofReact = userReactions[key as keyof typeof userReactions];
      keyofReact.userReact = [...keyofReact.userReact, user];
    };
    const reaction = () => {
      data?.forEach((data) => {
        switch (data.name) {
          case "like":
            fillReaction("like", data.user);
            break;
          case "love":
            fillReaction("love", data.user);
            break;
          case "wow":
            fillReaction("wow", data.user);
            break;
          case "care":
            fillReaction("care", data.user);
            break;
          case "haha":
            fillReaction("haha", data.user);
            break;
          case "angry":
            fillReaction("angry", data.user);
            break;
          case "sad":
            fillReaction("sad", data.user);
            break;
          default:
            break;
        }
      });
    };
    reaction();
    return userReactions;
  }, []);

  return (
    <>
      <div className={cx("wrapper", { dark: darkTheme })}>
        <div
          className={cx("close")}
          onClick={() => setIsShowUserReaction(false)}
        >
          <AiFillCloseCircle
            size="25"
            color={darkTheme ? "#525252" : "#c7c7c7"}
          />
        </div>
        <h6>Cam xuc ve tin nhan</h6>
        <div className={cx("tab")}>
          <div
            className={cx("tab-all", { currentTab: tab === "all" })}
            onClick={() => setTab("all")}
          >
            <h3>Tat ca </h3>
            <p className={cx("quantum")}>{data?.length}</p>
            <div className={cx("line")}></div>
          </div>
          {Object.entries(reactions).map((type, index) => {
            if (!type[1].userReact.length) {
              return "";
            }
            return (
              <div
                key={type[0]}
                className={cx("tab-single", {
                  currentTab: type[0] === tab,
                })}
                onClick={() => setTab(type[0])}
              >
                <img src={type[1].icon} alt="" />
                <span className={cx("quantum")}>
                  {type[1].userReact.length}
                </span>
                <div className={cx("line")}></div>
              </div>
            );
          })}
        </div>
        <ul className={cx("list-user")}>
          {Object.entries(reactions).map((e, index) => {
            if (tab === "all" || e[0] === tab) {
              return (
                <Fragment key={e[0]}>
                  {e[1].userReact.map((u) => {
                    return (
                      <li key={u._id}>
                        <div className={cx("user")}>
                          <LazyLoadImage
                            effect="blur"
                            width={40}
                            height={40}
                            src={u.photoURL}
                            alt=""
                          />
                          <p>{u.displayName}</p>
                        </div>
                        <div className={cx("emoji")}>
                          <img src={e[1].icon} alt="" />
                        </div>
                      </li>
                    );
                  })}
                </Fragment>
              );
            }
            return "";
          })}
        </ul>
      </div>
      <Overlay position="fixed" />
    </>
  );
};

export default React.memo(DetailUserReact);
