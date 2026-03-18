import type { AppLocale } from "./locale";

export function getLocalizedActionErrorFallback(locale: AppLocale) {
  switch (locale) {
    case "zh-TW":
      return "操作失敗，請稍後再試。";
    case "en":
      return "Action failed. Please try again later.";
    case "ja":
      return "操作に失敗しました。しばらくしてからもう一度お試しください。";
    default:
      return "操作失败，请稍后重试。";
  }
}

export function getLocalizedActionErrorMessage(
  code: string,
  locale: AppLocale,
  details?: string,
  fallback?: string
) {
  switch (code) {
    case "UNAUTHORIZED":
      switch (locale) {
        case "zh-TW":
          return "當前登入狀態已失效，請重新登入後再試。";
        case "en":
          return "Your sign-in session has expired. Please sign in again and retry.";
        case "ja":
          return "ログイン状態の有効期限が切れています。再度サインインしてからお試しください。";
        default:
          return "当前登录状态已失效，请重新登录后再试。";
      }
    case "ACCOUNT_INITIAL_FETCH_LIMIT_INVALID":
      switch (locale) {
        case "zh-TW":
          return "首次同步抓取範圍無效。";
        case "en":
          return "The initial sync fetch size is invalid.";
        case "ja":
          return "初回同期の取得件数が無効です。";
        default:
          return "首次同步抓取范围无效。";
      }
    case "ACCOUNT_IMAP_PORT_INVALID":
      switch (locale) {
        case "zh-TW":
          return "IMAP 埠無效。";
        case "en":
          return "The IMAP port is invalid.";
        case "ja":
          return "IMAP ポートが無効です。";
        default:
          return "IMAP 端口无效。";
      }
    case "ACCOUNT_SMTP_PORT_INVALID":
      switch (locale) {
        case "zh-TW":
          return "SMTP 埠無效。";
        case "en":
          return "The SMTP port is invalid.";
        case "ja":
          return "SMTP ポートが無効です。";
        default:
          return "SMTP 端口无效。";
      }
    case "ACCOUNT_MAILBOX_PRESET_UNSUPPORTED":
      switch (locale) {
        case "zh-TW":
          return "不支援的信箱預設。";
        case "en":
          return "The mailbox preset is not supported.";
        case "ja":
          return "このメールボックスプリセットには対応していません。";
        default:
          return "不支持的邮箱预设。";
      }
    case "ACCOUNT_AUTH_USER_REQUIRED":
      switch (locale) {
        case "zh-TW":
          return "登入使用者名稱不能為空。";
        case "en":
          return "The login username is required.";
        case "ja":
          return "ログインユーザー名は必須です。";
        default:
          return "登录用户名不能为空。";
      }
    case "ACCOUNT_AUTH_PASS_REQUIRED":
      switch (locale) {
        case "zh-TW":
          return "授權碼或密碼不能為空。";
        case "en":
          return "The app password or password is required.";
        case "ja":
          return "認証コードまたはパスワードは必須です。";
        default:
          return "授权码或密码不能为空。";
      }
    case "ACCOUNT_CUSTOM_HOST_REQUIRED":
      switch (locale) {
        case "zh-TW":
          return "自訂 IMAP/SMTP 帳號必須填寫伺服器地址。";
        case "en":
          return "Custom IMAP/SMTP accounts must provide server addresses.";
        case "ja":
          return "カスタム IMAP/SMTP アカウントではサーバーアドレスの入力が必要です。";
        default:
          return "自定义 IMAP/SMTP 账号必须填写服务器地址。";
      }
    case "ACCOUNT_EMAIL_REQUIRED":
      switch (locale) {
        case "zh-TW":
          return "信箱地址不能為空。";
        case "en":
          return "The email address is required.";
        case "ja":
          return "メールアドレスは必須です。";
        default:
          return "邮箱地址不能为空。";
      }
    case "ACCOUNT_NOT_FOUND":
      switch (locale) {
        case "zh-TW":
          return "找不到這個帳號。";
        case "en":
          return "The account could not be found.";
        case "ja":
          return "アカウントが見つかりません。";
        default:
          return "账号不存在。";
      }
    case "ACCOUNT_MAILBOX_EDIT_UNSUPPORTED":
      switch (locale) {
        case "zh-TW":
          return "目前帳號類型不支援編輯 IMAP/SMTP 憑證。";
        case "en":
          return "This account type does not support editing IMAP/SMTP credentials.";
        case "ja":
          return "このアカウント種別では IMAP/SMTP 認証情報を編集できません。";
        default:
          return "当前账号类型不支持编辑 IMAP/SMTP 凭据。";
      }
    case "OAUTH_APP_ID_REQUIRED":
      switch (locale) {
        case "zh-TW":
          return "OAuth App ID 不能為空。";
        case "en":
          return "The OAuth App ID is required.";
        case "ja":
          return "OAuth App ID は必須です。";
        default:
          return "OAuth App ID 不能为空。";
      }
    case "OAUTH_APP_ID_RESERVED":
      switch (locale) {
        case "zh-TW":
          return "default 保留給環境變數預設應用，不能用於資料庫設定。";
        case "en":
          return '"default" is reserved for environment-backed default apps and cannot be used for database config.';
        case "ja":
          return '"default" は環境変数側の既定アプリ用に予約されており、データベース設定には使えません。';
        default:
          return "default 保留给环境变量默认应用，不能用于数据库配置。";
      }
    case "OAUTH_APP_ID_INVALID":
      switch (locale) {
        case "zh-TW":
          return "OAuth App ID 只能包含小寫字母、數字、底線和連字號，且長度需為 2-63。";
        case "en":
          return "The OAuth App ID must be 2-63 characters long and use only lowercase letters, numbers, underscores, or hyphens.";
        case "ja":
          return "OAuth App ID は 2〜63 文字で、小文字・数字・アンダースコア・ハイフンのみ使用できます。";
        default:
          return "OAuth App ID 只能包含小写字母、数字、下划线和连字符，且长度为 2-63。";
      }
    case "OAUTH_APP_LABEL_REQUIRED":
      switch (locale) {
        case "zh-TW":
          return "應用名稱不能為空。";
        case "en":
          return "The app name is required.";
        case "ja":
          return "アプリ名は必須です。";
        default:
          return "应用名称不能为空。";
      }
    case "OAUTH_APP_CLIENT_ID_REQUIRED":
      switch (locale) {
        case "zh-TW":
          return "Client ID 不能為空。";
        case "en":
          return "The Client ID is required.";
        case "ja":
          return "Client ID は必須です。";
        default:
          return "Client ID 不能为空。";
      }
    case "OAUTH_APP_CLIENT_SECRET_REQUIRED":
      switch (locale) {
        case "zh-TW":
          return "Client Secret 不能為空。";
        case "en":
          return "The Client Secret is required.";
        case "ja":
          return "Client Secret は必須です。";
        default:
          return "Client Secret 不能为空。";
      }
    case "OAUTH_APP_NOT_FOUND":
      switch (locale) {
        case "zh-TW":
          return "OAuth 應用不存在。";
        case "en":
          return "The OAuth app could not be found.";
        case "ja":
          return "OAuth アプリが見つかりません。";
        default:
          return "OAuth 应用不存在。";
      }
    case "OAUTH_APP_IN_USE": {
      const count = Number(details ?? "0");
      switch (locale) {
        case "zh-TW":
          return `仍有 ${count} 個帳號正在使用這個 OAuth 應用，請先重新授權或移除這些帳號。`;
        case "en":
          return `${count} account(s) are still using this OAuth app. Reauthorize or remove those accounts first.`;
        case "ja":
          return `この OAuth アプリをまだ ${count} 件のアカウントが使用しています。先に再認可するか、それらのアカウントを削除してください。`;
        default:
          return `仍有 ${count} 个账号在使用这个 OAuth 应用，请先重新授权或移除这些账号。`;
      }
    }
    default:
      return fallback || getLocalizedActionErrorFallback(locale);
  }
}
