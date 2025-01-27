import { momentCategories } from '../routes/EditMoment';
import { spaceCategories } from '../routes/EditSpace';

const allCategories: string[] = [...new Set([...momentCategories, ...spaceCategories])];

const SELECT_ALL = 'selectAll';

export {
    allCategories,
    SELECT_ALL,
};
