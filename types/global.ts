export type color =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'destructive';

export type InputColor =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'destructive';

export type shadow = 'sm' | 'md' | 'lg' | 'xl';
export type size = 'default' | 'sm' | 'md' | 'lg';
export type rounded = 'sm' | 'md' | 'lg' | 'full';
export type radius = 'sm' | 'md' | 'lg' | 'xl' | 'none';

export type ActionResult<T = any> = {
    success: boolean;
    message: string;
    data?: T;
    cooldownTime?: number;
};

export type ParamsSlug = Promise<{ slug: string }>;
