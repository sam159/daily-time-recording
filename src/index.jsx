import { useForm } from "react-hook-form";
import { render } from 'preact';
import {useEffect, useState} from "preact/hooks";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import {minsToTime, timeRe} from "./time.js";

import 'xp.css/dist/XP.css';
import './style.css';
import {durationRe} from "./duration.js";
import Duration from "./Duration.jsx";
import calculateRemaining from "./calc.js";

const schema = yup.object({
	startTime: yup.string().matches(timeRe, {message: '12 or 24 hr time format required'}).required(),
	target: yup.string().matches(durationRe, {message: 'duration in hh:mm or hrs and mins required'}).required(),
	break: yup.string().matches(durationRe, {message: 'duration in hh:mm or hrs and mins required'}).required(),
	breakTaken: yup.bool().required(),
	recorded: yup.string().matches(durationRe, {message: 'duration in hh:mm or hrs and mins required'}).required()
}).required();

export function App() {
	const {
		handleSubmit,
		register,
		formState: { errors },
		watch
	} = useForm({
		defaultValues: {
			startTime: '09:00',
			target: '7.5h',
			break: '1h',
			recorded: ''
		},
		resolver: yupResolver(schema)
	});

	const [currentData, setCurrentData] = useState(null);
	const [remaining, setRemaining] = useState(0);

	const onSubmit = (data) => {
		setCurrentData({...data});
	};

	// update remaining when data changes and re-calc every minute
	useEffect(() => {
		if (!currentData) {
			return;
		}
		setRemaining(calculateRemaining(currentData));

		const interval = setInterval(() => {
			setRemaining(calculateRemaining(currentData));
		}, 60000);
		return () => clearInterval(interval);
	}, [currentData]);

	// submit form when field changes
	useEffect(() => {
		const sub = watch(handleSubmit(onSubmit));
		return () => sub.unsubscribe();
	}, [handleSubmit, watch]);

	return (
		<div class="window" style={{margin: "32px auto", width: "250px"}}>
			<div class="title-bar">
				<div class="title-bar-text">
					Daily Time Tracking
				</div>
				<div class="title-bar-controls">
					<button type="button" aria-label="Close" />
				</div>
			</div>
			<div class="window-body">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div class="field-row-stacked">
						<label for="StartTime">Start Time</label>
						<input type="text" id="StartTime" {...register("startTime", {  })} />
					</div>
					{errors?.startTime && <p class="error-message">{errors.startTime.message}</p>}
					<Duration
						label="Target Duration"
						id="TargetDuration"
						name="target"
						errors={errors?.target}
						register={register}
					/>
					<Duration
						label="Break Duration"
						id="BreakDuration"
						name="break"
						errors={errors?.break}
						register={register}
					/>
					<div class="field-row">
						<input type="checkbox" id="BreakTaken" {...register("breakTaken")} />
						<label for="BreakTaken">Break Taken</label>
					</div>
					<Duration
						label="Recorded Duration"
						id="RecordedDuration"
						name="recorded"
						errors={errors?.recorded}
						register={register}
					/>

					<p>
						<button type="submit">Calculate</button>
					</p>
					
					<div class="field-row-stacked">
						<label for="RemainingTime">Remaining Time</label>
						<input type="text" id="RemainingTime" value={minsToTime(remaining)} readonly />
					</div>
				</form>
			</div>
		</div>
	);
}

render(<App />, document.getElementById('app'));
