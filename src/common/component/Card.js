import styled, { css } from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  CardActions,
} from "@material-ui/core";
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
} from "@material-ui/icons";
import { blue, green, red } from "@material-ui/core/colors";
import { getCategory } from "../categoryCode";
import { Link } from "react-router-dom";
import defaultImage from "../../images/defaultImage.png";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../reducer/detail";
import { actions as userActions } from "../reducer/user";
import device from "../device";

const StyledCard = styled(Card)`
  height: 500px;
  margin: 0 7px;
  min-width: 480px;
  transition: all 0.7s ease-out;
  position: relative;

  &:hover {
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1), 0px 2px 3px rgba(0, 0, 0, 0.12),
      0px 1px 3px rgba(0, 0, 0, 0.14);
    transform: translateY(-5px);
    cursor: pointer;
  }
  & .MuiCardHeader-root {
    padding: 10px;
  }
  & .MuiCardHeader-content {
    display: flex;
    width: 100%;
    align-items: center;
  }
  @media ${device.tablet} {
    min-width: 300px;
    height: 440px;
  }
`;

const BottomIconsWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 6px;
`;
const MarksWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;

  width: 100%;
  & div {
    margin: 0 4px;
  }

  @media ${device.tablet} {
    margin: 0;
  }
`;
const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "66%", // 330 * 500
  },
  typeAvatar: {
    fontSize: "small",
    fontWeight: "bold",
    backgroundColor: "#484848",
  },
  blue: {
    marginRight: "20px",
    fontSize: "x-small",
    fontWeight: "bold",
    color: "white",
    backgroundColor: blue[800],
  },
  red: {
    marginRight: "20px",
    fontSize: "x-small",
    fontWeight: "bold",
    color: "white",
    backgroundColor: red[900],
  },
  green: {
    marginRight: "20px",
    fontSize: "x-small",
    fontWeight: "bold",
    color: "white",
    backgroundColor: green[900],
  },
  content: {
    padding: "0 16px",
  },
  small: {
    fontSize: "1.35rem",
  },
}));
const Badge = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 15px;
  border: 2px solid ${(props) => (props.color === "red" ? "red" : "green")};
  padding: 4px;
  margin: 0 3px;
  color: ${(props) => (props.color === "red" ? "red" : "green")};
  word-break: keep-all;
`;
const HeartBtn = styled(IconButton)`
  ${(props) =>
    props.heart &&
    css`
      color: red !important;
    `}
`;

// image, title, description, category 를 입력받아 Card를 리턴하는 컴포넌트 함수
export default function PlaceCard(props) {
  const classes = useStyles();
  const { simple, place } = props;
  const {
    contentid,
    contenttypeid,
    firstimage,
    type,
    title,
    date,
    addr1,
    readcount,
    tel,
    dist,
    isOnline,
    isClose,
    isPopular,
    isLoading,
  } = place;

  const { hearts, isLoggedIn } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const setIds = React.useCallback(
    (contentTypeId, contentId) => {
      dispatch(actions.setIds({ contentTypeId, contentId }));
    },
    [dispatch]
  );
  const setPlace = React.useCallback(
    (place) => {
      dispatch(
        actions.setPlace({
          ...place,
          isClose: place.dist <= 1000,
        })
      );
    },
    [dispatch]
  );

  const isHeart = React.useMemo(
    () =>
      hearts.some((heart) => parseInt(heart.contentid) === parseInt(contentid)),
    [contentid, hearts]
  );

  const handleClickCard = (contentTypeId, contentId, place) => {
    setIds(contentTypeId, contentId);
    setPlace(place);
  };
  const handleClickHeart = () => {
    if (isLoggedIn) {
      dispatch(userActions.setHeartsRequest(place));
    }
  };
  const abbreviationTitle =
    title.length >= 40 ? title.slice(0, 40) + "..." : title;

  return (
    <StyledCard>
      <Link to={`/place/${contenttypeid}/${contentid}`}>
        <CardMedia
          className={classes.media}
          image={firstimage || defaultImage}
          title={abbreviationTitle}
          onClick={() => handleClickCard(contenttypeid, contentid, place)}
        />
      </Link>
      <CardHeader
        className={classes.small}
        title={
          <>
            {abbreviationTitle}
            {isPopular && <Badge color="red"> 인기 </Badge>}
            {isOnline ? (
              <Badge color="green"> 온라인 </Badge>
            ) : isClose ? (
              <Badge color="green"> 가까움 </Badge>
            ) : null}
          </>
        }
      />
      <CardContent className={classes.content}>
        <Typography variant="body2" color="textSecondary" component="p">
          {addr1}
        </Typography>
        {!simple && (
          <Typography variant="body2" color="textSecondary" component="p">
            {tel}
          </Typography>
        )}
      </CardContent>
      <BottomIconsWrap>
        <CardActions disableSpacing>
          <HeartBtn onClick={handleClickHeart} heart={isHeart ? 1 : 0}>
            <FavoriteIcon />
          </HeartBtn>
          <IconButton>
            <ShareIcon />
          </IconButton>
        </CardActions>
        <MarksWrap>
          <Avatar className={classes.typeAvatar}>
            {getCategory(contenttypeid)}
          </Avatar>
          <Avatar
            className={
              isOnline ? classes.green : isClose ? classes.blue : classes.red
            }
          >
            {isOnline ? "Online" : Math.ceil(dist / 100) / 10 + "KM"}
          </Avatar>
        </MarksWrap>
      </BottomIconsWrap>
    </StyledCard>
  );
}
