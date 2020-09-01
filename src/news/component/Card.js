
import { makeStyles } from "@material-ui/core/styles";
import {Card, CardHeader, CardMedia, CardContent,
    Avatar, IconButton, Typography, CardActions} from "@material-ui/core";
import { Favorite as FavoriteIcon, Share as ShareIcon, MoreVert as MoreVertIcon} from '@material-ui/icons'
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    root: {
      width: 330,
      minWidth: 330,
      height: 500,
      margin: "0 0.7rem",
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    avatarRed: {
      backgroundColor: red[500]
    },
  }));
// image, title, description, category 를 입력받아 Card를 리턴하는 컴포넌트 함수
export default function NewsCard( { image, category, title, description, originalLink, date, company} ) {
    const classes = useStyles();
    // desciprion 100글자 제한 + 말줄임표
    const subString = (desc,count) => {
        const isString = typeof desc === "string";
        return (isString && desc.length >= count? desc.substring(0,count) + "..." : desc);
    }
    return (
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="news" className={classes.avatar}>
                {company? company[0]+company[1] : ''}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={subString(title, 20)}
            subheader={date}
          />
          <CardMedia
            className={classes.media}
            image={image}
            title={title}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
                {subString(description, 80)}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      );
}