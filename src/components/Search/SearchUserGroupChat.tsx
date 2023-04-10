import { useRef, useState } from "react";
import { User } from "../../shared/type";
import { CiSearch } from "react-icons/ci";
import { useAppSelector } from "../../store/hook";
import { AiFillCloseCircle } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FcCheckmark } from "react-icons/fc";
import { BiCheckbox } from "react-icons/bi";
import { useSearchUser } from "../../service/Query/UseQuery";
import Tippy from "@tippyjs/react/headless";
import { useQuerySelector } from "../../service/Query/querySelector";

import classnames from "classnames/bind";
import styles from "./Search.module.scss";

const cx = classnames.bind(styles);
interface SearchUserGroupChatProps {
  type: "CreateGroupChat" | "AddUserToGroupChat";
  userAdded: User[];
  handleAddUserToListCreateRoom: (user: User) => void;
}
const SearchUserGroupChat: React.FC<SearchUserGroupChatProps> = ({
  type,
  userAdded,
  handleAddUserToListCreateRoom,
}) => {
  const { currentRoom } = useQuerySelector();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef() as any;
  const { data: searchResult, isLoading } = useSearchUser(
    search,
    type === "CreateGroupChat"
      ? [user?._id || ""]
      : [user?._id || "", ...(currentRoom?.users?.map((u) => u.user._id) || "")]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.startsWith(" ")) {
      setSearch(e.target.value);
    }
  };
  const handleClose = () => {
    setSearch("");
  };
  return (
    <div
      className={cx("search-user-create-room", { dark: theme })}
      ref={searchInputRef}
    >
      <Tippy
        interactive
        visible={searchResult.length ? true : false}
        maxWidth="520px"
        onClickOutside={() => setSearch("")}
        placement="bottom"
        offset={[0, 10]}
        render={() => {
          return (
            <>
              {search && searchResult.length > 0 && !isLoading && (
                <div
                  className={cx("search-result", { users: true, dark: theme })}
                >
                  <ul>
                    {searchResult?.map((item) => {
                      return (
                        <li
                          key={item._id}
                          onClick={() => handleAddUserToListCreateRoom(item)}
                        >
                          <LazyLoadImage
                            width={40}
                            height={40}
                            effect="blur"
                            src={
                              item.photoURL ||
                              require("../../assets/image/user-account.png")
                            }
                            alt=""
                          />
                          <p>{item.displayName}</p>
                          <button
                            className={cx({
                              "join-room": true,
                              added: userAdded.some((e) => item._id === e._id),
                            })}
                          >
                            {(userAdded.some((e) => item._id === e._id) && (
                              <FcCheckmark size="30" />
                            )) || <BiCheckbox size="30" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          );
        }}
      >
        <input placeholder="Tìm kiếm" value={search} onChange={handleSearch} />
      </Tippy>
      <div className={cx("search-user-icon")}>
        {(!search && <CiSearch size={20} color="#b1b4b7" />) || (
          <AiFillCloseCircle size={15} color="#ff4e4e" onClick={handleClose} />
        )}
      </div>
    </div>
  );
};

export default SearchUserGroupChat;
