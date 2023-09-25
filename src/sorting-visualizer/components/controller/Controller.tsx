import {
  convertArrayStringToArray,
  convertInputToArrayString,
  getRndmNumInRange,
} from "@/sorting-visualizer/helpers/array";
import {
  setArray,
  setIsPlaying,
  setReset,
  startTimer,
} from "@/sorting-visualizer/store/app.slice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/sorting-visualizer/hooks/hooks";
import { useEffect, useState } from "react";

import classes from "./controls.module.scss";
import { setSpeed } from "@/sorting-visualizer/store/global";
import { useParams } from "react-router-dom";

function Controller() {
  const array = useAppSelector((state) => state.app.array);
  const dispatch = useAppDispatch();
  const [input, setInput] = useState(array.join(", "));
  const isPlaying = useAppSelector((state) => state.app.isPlaying);
  const reset = useAppSelector((state) => state.app.reset);
  const { algoName } = useParams();

  useEffect(() => {
    if (isPlaying) {
      dispatch(startTimer());
    }
  }, [dispatch, isPlaying]);

  useEffect(() => {
    dispatch(setIsPlaying(false));
    dispatch(setReset());
  }, [array, algoName, dispatch]);

  useEffect(() => {
    dispatch(setIsPlaying(false));
  }, [dispatch, reset]);

  const onRandomize = () => {
    const newInput = Array.from(new Array(getRndmNumInRange(5, 20)), () =>
      getRndmNumInRange()
    );
    setInput(newInput.join(", "));
    dispatch(setArray(newInput));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAsStr = convertInputToArrayString(e.target.value);
    setInput(inputAsStr);
    dispatch(setArray(convertArrayStringToArray(inputAsStr)));
  };

  return (
    <section className={classes.controller}>
      <div className={classes.numbers}>
        <button className={classes.rndmBtn} onClick={onRandomize}>
          Randomize
        </button>
        <input
          className={classes.input}
          type="text"
          placeholder="Numbers to sort (comma separate - max 3 digits)"
          value={input}
          onChange={onChange}
        />
      </div>

      <div className={classes.controls}>
        <button
          onClick={() => dispatch(setIsPlaying(!isPlaying))}
          disabled={array.length === 0 || isPlaying === null}
        >
          <img
            src={isPlaying ? "/pause.svg" : "/play.svg"}
            alt={isPlaying ? "Pause" : "Play"}
            height={24}
            width={24}
          />
        </button>

        <button
          onClick={() => dispatch(setReset())}
          disabled={array.length === 0}
        >
          <img src="/reset.svg" height={24} width={24} />
        </button>

        <input
          type="range"
          min={1}
          max={10}
          defaultValue={1}
          step={1}
          onChange={(e) => setSpeed(e.target.valueAsNumber)}
        />
      </div>
    </section>
  );
}

export default Controller;
