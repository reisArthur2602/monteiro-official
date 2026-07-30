import { redirectRole } from '@/utils';
import { PropsWithChildren } from 'react';

const TemplatesLayout = async ({ children }: PropsWithChildren) => {
    await redirectRole(['ADMINISTRADOR']);
    return children;
};

export default TemplatesLayout;
