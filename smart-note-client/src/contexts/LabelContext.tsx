import { createContext, useState } from 'react';
import { LabelResponse } from '../shared/models/label';

interface LabelContextType {
    labelList: LabelResponse[];
    setLabelList: (categoryList: LabelResponse[]) => void;
}

const LabelContext = createContext<LabelContextType | null>(null);

const LabelProvider = ({ children }: any) => {
    const [labelList, setLabelList] = useState<LabelResponse[]>([]);

    const value = {
      labelList,
      setLabelList,
    };

    return <LabelContext.Provider value={value as LabelContextType}>{children}</LabelContext.Provider>;
};

export { LabelContext, LabelProvider };
