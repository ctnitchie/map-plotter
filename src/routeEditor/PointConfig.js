import React from 'react';

export default function PointConfig(props) {
  const plot = props.plot;
  const point = props.point;
  console.log(point);

  function onSourceChange(e) {
    console.log(e.target.value);
  }

  function updatePoint(e, prop) {
    const newPoint = {...point};
    point[prop] = e.target.value;
    props.onChange(newPoint);
  }

  return (
    <div className="pointConfig col-12">
      <div className="row">
        <select onChange={onSourceChange} value={point.startsAt} className="col-5">
          <option value="">Select...</option>
          <option>East Platform</option>
          <option>Tank</option>
          <option>West Platform</option>
          <option>Test</option>
        </select>
        <input type="text" className="col-5" placeholder="Label"
            onChange={e => updatePoint(e, 'label')} value={point.label}/>
        <input type="number" className="col-2" min="0" max="359"
            onChange={e => updatePoint(e, 'heading')} value={point.heading}/>
      </div>
    </div>
  );
}
