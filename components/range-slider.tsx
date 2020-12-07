import * as React from "react";
import { Range, getTrackBackground } from "react-range";

type RangeSliderProps = {
  values: number[];
  onChange: Function;
};

const RangeSlider = (props: RangeSliderProps) => {
  const STEP = 100;
  const MIN = 500;
  const MAX = 20000;
  // const [values, setValues] = React.useState([3000]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Range
        values={props.values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={(values) => props.onChange(values)}
        renderTrack={({ props: renderProps, children }) => (
          <div
            onMouseDown={renderProps.onMouseDown}
            onTouchStart={renderProps.onTouchStart}
            style={{
              ...renderProps.style,
              height: "36px",
              display: "flex",
              width: "100%",
            }}
          >
            <div
              ref={renderProps.ref}
              style={{
                height: "5px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values: props.values,
                  colors: ["#ae2c22", "#ccc"],
                  min: MIN,
                  max: MAX,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props: renderThumbProps, isDragged }) => (
          <div
            {...renderThumbProps}
            style={{
              ...renderThumbProps.style,
              height: "24px",
              width: "24px",
              borderRadius: "4px",
              backgroundColor: "#FFF",
              display: "flex",
              outline: "none",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 2px 6px #AAA",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-28px",
                color: "#fff",
                fontWeight: "bold",

                fontSize: "14px",
                fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
                padding: "4px",
                borderRadius: "4px",
                backgroundColor: "#ae2c22",
              }}
            >
              {props.values[0].toFixed()}
            </div>
            <div
              style={{
                height: "16px",
                width: "5px",
                backgroundColor: isDragged ? "#ae2c22" : "#CCC",
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default RangeSlider;
