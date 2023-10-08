import {
  CreatePostController,
  DeletePostController,
  UpdatePostController,
} from "../../../models/Post/controllers/post";
import { RouteItem } from "../../express";

const defaultPath = "/post";
const routes: RouteItem[] = [
  {
    path: defaultPath,
    method: "post",
    action: CreatePostController,
  },
  {
    path: `${defaultPath}/:postId`,
    method: "patch",
    action: UpdatePostController,
  },
  {
    path: `${defaultPath}/:postId`,
    method: "delete",
    action: DeletePostController,
  },
];

export default routes;
