import { User } from "../../shared/type";
import { AiFillCloseCircle } from "react-icons/ai";
import Tippy from "@tippyjs/react/headless";
import { useAppSelector } from "../../store/hook";
import { useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Socket } from "socket.io-client";
import { useSearchUser } from "../../service/Query/UseQuery";

import styles from "./Search.module.scss";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);
interface SearchBoxProps {
  socket: Socket;
}
const SearchRoom: React.FC<SearchBoxProps> = ({ socket }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [search, setSearch] = useState("");
  const user = useAppSelector((state) => state.auth.user);
  const searchInputRef = useRef() as any;
  const { data: searchResult, isLoading } = useSearchUser(search, [
    user?._id || "",
  ]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.startsWith(" ")) {
      setSearch(e.target.value);
      return;
    }
    setSearch("");
  };
  const handleClose = () => {
    setSearch("");
    // setSearchResult([]);
  };
  const handleCreateRoom = (privateChatInviting: User) => {
    socket.emit("create_room_with_private", {
      currentUser: user,
      privateChatInviting,
      photoRoomURL: require("../../assets/image/user.png"),
    });
    setSearch("");
  };

  return (
    <div
      className={cx("search-user-private-chat", { dark: theme })}
      ref={searchInputRef}
    >
      <Tippy
        interactive
        visible={searchResult.length ? true : false}
        maxWidth="100%"
        onClickOutside={() => setSearch("")}
        offset={[0, 0]}
        render={() => {
          return (
            <>
              {search && searchResult.length > 0 && !isLoading && (
                <div className={cx("search-result", { dark: theme })}>
                  <ul>
                    {searchResult.map((item) => {
                      return (
                        <li
                          key={item._id}
                          onClick={() => handleCreateRoom(item)}
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
        <input
          type="text"
          placeholder="Nhắn tin riêng tư"
          value={search}
          onChange={handleSearch}
        />
      </Tippy>
      <button className={cx("close-searchTab")} onClick={handleClose}>
        {(!search && <CiSearch size={20} color={"#858585"} />) || (
          <AiFillCloseCircle
            size={20}
            color={theme ? "#6c6c6c" : "#c7c7c7"}
            onClick={handleClose}
          />
        )}
      </button>
    </div>
  );
};

export default SearchRoom;
