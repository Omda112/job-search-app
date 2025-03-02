export const pagination = async ({ page = 1, sort, filter , model, populate = [] }) => {
    let _page = parseInt(page) || 1;
    if (_page < 1) _page = 1;
    
    const limit = 2;
    const skip = (_page - 1) * limit;
    console.log(filter);
    
    const totalCount = await model.countDocuments(filter);

    const data = await model.find(filter)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .populate(populate);

    return { data, _page, totalCount };
};
