import { Segment, useDefault } from 'segmentit';

const segmentit = useDefault(new Segment());
lunr.segmentit = segmentit;
lunr.queryHandler = query => {
    if (/^[\u4e00-\u9fa5]+$/.test(query)) query = lunr.segmentit.doSegment(query).map(seg => '+' + seg.w).join(' ');
    return query;
};
