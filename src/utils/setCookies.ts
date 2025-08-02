import { Response } from "express";

export interface IUserTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthCookie = async (res: Response, userTokens: IUserTokens) => {
  if (userTokens.accessToken) {
    res.cookie("accessToken", userTokens.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }

  if (userTokens.refreshToken) {
    res.cookie("refreshToken", userTokens.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
