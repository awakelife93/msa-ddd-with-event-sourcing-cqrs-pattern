import {
  GetAllPostController,
  GetPostByIdController,
  GetPostController,
} from "../../../models/Post/controllers/post";
import { RouteItem } from "../../express";

const defaultPath = "/post";
const routes: RouteItem[] = [
  {
    path: `${defaultPath}/:postId`,
    method: "get",
    action: GetPostByIdController,
  },
  {
    path: defaultPath,
    method: "get",
    action: GetPostController,
  },
  {
    path: `${defaultPath}s`,
    method: "get",
    action: GetAllPostController,
  },
];

export default routes;
