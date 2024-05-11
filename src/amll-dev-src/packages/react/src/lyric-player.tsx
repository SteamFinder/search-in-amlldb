import {
	LyricPlayer as CoreLyricPlayer,
	type LyricLineMouseEvent,
	type LyricLine,
	type spring,
} from "@applemusic-like-lyrics/core";
import {
	useRef,
	useEffect,
	forwardRef,
	useImperativeHandle,
	type HTMLProps,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/**
 * 歌词播放组件的属性
 */
export interface LyricPlayerProps {
	/**
	 * 是否禁用歌词播放组件，默认为 `false`，歌词组件启用后将会开始逐帧更新歌词的动画效果，并对传入的其他参数变更做出反馈。
	 *
	 * 如果禁用了歌词组件动画，你也可以通过引用取得原始渲染组件实例，手动逐帧调用其 `update` 函数来更新动画效果。
	 */
	disabled?: boolean;
	/**
	 * 是否演出部分效果，目前会控制播放间奏点的动画的播放暂停与否，默认为 `true`
	 */
	playing?: boolean;
	/**
	 * 设置歌词行的对齐方式，如果为 `undefined` 则默认为 `center`
	 *
	 * - 设置成 `top` 的话将会向目标歌词行的顶部对齐
	 * - 设置成 `bottom` 的话将会向目标歌词行的底部对齐
	 * - 设置成 `center` 的话将会向目标歌词行的垂直中心对齐
	 */
	alignAnchor?: "top" | "bottom" | "center";
	/**
	 * 设置默认的歌词行对齐位置，相对于整个歌词播放组件的大小位置，如果为 `undefined`
	 * 则默认为 `0.5`
	 *
	 * 可以设置一个 `[0.0-1.0]` 之间的任意数字，代表组件高度由上到下的比例位置
	 */
	alignPosition?: number;
	/**
	 * 设置是否使用物理弹簧算法实现歌词动画效果，默认启用
	 *
	 * 如果启用，则会通过弹簧算法实时处理歌词位置，但是需要性能足够强劲的电脑方可流畅运行
	 *
	 * 如果不启用，则会回退到基于 `transition` 的过渡效果，对低性能的机器比较友好，但是效果会比较单一
	 */
	enableSpring?: boolean;
	/**
	 * 设置是否启用歌词行的模糊效果，默认为 `true`
	 */
	enableBlur?: boolean;
	/**
	 * 设置是否使用物理弹簧算法实现歌词动画效果，默认启用
	 *
	 * 如果启用，则会通过弹簧算法实时处理歌词位置，但是需要性能足够强劲的电脑方可流畅运行
	 *
	 * 如果不启用，则会回退到基于 `transition` 的过渡效果，对低性能的机器比较友好，但是效果会比较单一
	 */
	enableScale?: boolean;
	/**
	 * 设置是否隐藏已经播放过的歌词行，默认不隐藏
	 */
	hidePassedLines?: boolean;
	/**
	 * 设置当前播放歌词，要注意传入后这个数组内的信息不得修改，否则会发生错误
	 */
	lyricLines?: LyricLine[];
	/**
	 * 设置当前播放进度，单位为毫秒且**必须是整数**，此时将会更新内部的歌词进度信息
	 * 内部会根据调用间隔和播放进度自动决定如何滚动和显示歌词，所以这个的调用频率越快越准确越好
	 */
	currentTime?: number;
	isSeeking?: boolean;
	/**
	 * 设置是否应用提前歌词行时序，默认为 `true`
	 */
	enableLyricAdvanceDynamicLyricTime?: boolean;
	/**
	 * 设置文字动画的渐变宽度，单位以歌词行的主文字字体大小的倍数为单位，默认为 0.5，即一个全角字符的一半宽度
	 *
	 * 如果要模拟 Apple Music for Android 的效果，可以设置为 1
	 *
	 * 如果要模拟 Apple Music for iPad 的效果，可以设置为 0.5
	 *
	 * 如果想要近乎禁用渐变效果，可以设置成非常接近 0 的小数（例如 `0.0001` ），但是**不可以为 0**
	 */
	wordFadeWidth?: number;
	/**
	 * 设置所有歌词行在横坐标上的弹簧属性，包括重量、弹力和阻力。
	 *
	 * @param params 需要设置的弹簧属性，提供的属性将会覆盖原来的属性，未提供的属性将会保持原样
	 */
	linePosXSpringParams?: Partial<spring.SpringParams>;
	/**
	 * 设置所有歌词行在​纵坐标上的弹簧属性，包括重量、弹力和阻力。
	 *
	 * @param params 需要设置的弹簧属性，提供的属性将会覆盖原来的属性，未提供的属性将会保持原样
	 */
	linePosYSpringParams?: Partial<spring.SpringParams>;
	/**
	 * 设置所有歌词行在​缩放大小上的弹簧属性，包括重量、弹力和阻力。
	 *
	 * @param params 需要设置的弹簧属性，提供的属性将会覆盖原来的属性，未提供的属性将会保持原样
	 */
	lineScaleSpringParams?: Partial<spring.SpringParams>;
	/**
	 * 在一个特殊的底栏元素内加入指定元素，默认是空白的，可以往内部添加任意元素
	 *
	 * 这个元素始终在歌词的底部，可以用于显示歌曲创作者等信息
	 */
	bottomLine?: ReactNode;
	/**
	 * 当某个歌词行被左键点击时触发的事件
	 * @param line 歌词行的事件对象，可以访问到对应的歌词行信息和歌词行索引
	 */
	onLyricLineClick?: (line: LyricLineMouseEvent) => void;
	/**
	 * 当某个歌词行被右键点击时触发的事件
	 * @param line 歌词行的事件对象，可以访问到对应的歌词行信息和歌词行索引
	 */
	onLyricLineContextMenu?: (line: LyricLineMouseEvent) => void;
}

/**
 * 歌词播放组件的引用
 */
export interface LyricPlayerRef {
	/**
	 * 歌词播放实例
	 */
	lyricPlayer?: CoreLyricPlayer;
	/**
	 * 将歌词播放实例的元素包裹起来的 DIV 元素实例
	 */
	wrapperEl: HTMLDivElement | null;
}

/**
 * 歌词播放组件，本框架的核心组件
 *
 * 尽可能贴切 Apple Music for iPad 的歌词效果设计，且做了力所能及的优化措施
 */
export const LyricPlayer = forwardRef<
	LyricPlayerRef,
	HTMLProps<HTMLDivElement> & LyricPlayerProps
>(
	(
		{
			disabled,
			playing,
			alignAnchor,
			alignPosition,
			enableSpring,
			enableBlur,
			enableScale,
			hidePassedLines,
			lyricLines,
			currentTime,
			isSeeking,
			enableLyricAdvanceDynamicLyricTime,
			wordFadeWidth,
			linePosXSpringParams,
			linePosYSpringParams,
			lineScaleSpringParams,
			bottomLine,
			onLyricLineClick,
			onLyricLineContextMenu,
			...props
		},
		ref,
	) => {
		const corePlayerRef = useRef<CoreLyricPlayer>();
		const wrapperRef = useRef<HTMLDivElement>(null);
		const currentTimeRef = useRef(currentTime);

		useEffect(() => {
			corePlayerRef.current = new CoreLyricPlayer();
			return () => {
				corePlayerRef.current?.dispose();
			};
		}, []);

		useEffect(() => {
			if (!disabled) {
				let canceled = false;
				let lastTime = -1;
				const onFrame = (time: number) => {
					if (canceled) return;
					if (lastTime === -1) {
						lastTime = time;
					}
					corePlayerRef.current?.update(time - lastTime);
					lastTime = time;
					requestAnimationFrame(onFrame);
				};
				requestAnimationFrame(onFrame);
				return () => {
					canceled = true;
				};
			}
		}, [disabled]);

		useEffect(() => {
			if (playing !== undefined) {
				if (playing) {
					corePlayerRef.current?.resume();
				} else {
					corePlayerRef.current?.pause();
				}
			} else corePlayerRef.current?.resume();
		}, [playing]);

		useEffect(() => {
			if (corePlayerRef.current)
				wrapperRef.current?.appendChild(corePlayerRef.current.getElement());
		}, [wrapperRef.current]);

		useEffect(() => {
			if (alignAnchor !== undefined)
				corePlayerRef.current?.setAlignAnchor(alignAnchor);
		}, [alignAnchor]);

		useEffect(() => {
			if (hidePassedLines !== undefined)
				corePlayerRef.current?.setHidePassedLines(hidePassedLines);
		}, [hidePassedLines]);

		useEffect(() => {
			if (alignPosition !== undefined)
				corePlayerRef.current?.setAlignPosition(alignPosition);
		}, [alignPosition]);

		useEffect(() => {
			if (enableSpring !== undefined)
				corePlayerRef.current?.setEnableSpring(enableSpring);
			else corePlayerRef.current?.setEnableSpring(true);
		}, [enableSpring]);

		useEffect(() => {
			if (enableScale !== undefined)
				corePlayerRef.current?.setEnableScale(enableScale);
			else corePlayerRef.current?.setEnableScale(true);
		}, [enableScale]);

		useEffect(() => {
			corePlayerRef.current?.setEnableBlur(enableBlur ?? true);
		}, [enableBlur]);

		useEffect(() => {
			if (currentTime !== undefined) {
				corePlayerRef.current?.setCurrentTime(currentTime);
				currentTimeRef.current = currentTime;
			} else corePlayerRef.current?.setCurrentTime(0);
		}, [currentTime]);

		useEffect(() => {
			corePlayerRef.current?.setLyricAdvanceDynamicLyricTime(
				enableLyricAdvanceDynamicLyricTime ?? true,
			);
		}, [enableLyricAdvanceDynamicLyricTime]);

		useEffect(() => {
			if (lyricLines !== undefined) {
				corePlayerRef.current?.setLyricLines(
					lyricLines,
					currentTimeRef.current,
				);
				corePlayerRef.current?.update();
			} else {
				corePlayerRef.current?.setLyricLines([]);
				corePlayerRef.current?.update();
			}
		}, [lyricLines]);

		useEffect(() => {
			corePlayerRef.current?.setIsSeeking(!!isSeeking);
		}, [isSeeking]);

		useEffect(() => {
			corePlayerRef.current?.setWordFadeWidth(wordFadeWidth);
		}, [wordFadeWidth]);

		useEffect(() => {
			if (linePosXSpringParams !== undefined)
				corePlayerRef.current?.setLinePosXSpringParams(linePosXSpringParams);
		}, [linePosXSpringParams]);

		useEffect(() => {
			if (linePosYSpringParams !== undefined)
				corePlayerRef.current?.setLinePosYSpringParams(linePosYSpringParams);
		}, [linePosYSpringParams]);

		useEffect(() => {
			if (lineScaleSpringParams !== undefined)
				corePlayerRef.current?.setLineScaleSpringParams(lineScaleSpringParams);
		}, [lineScaleSpringParams]);

		useEffect(() => {
			if (onLyricLineClick) {
				const handler = (e: Event) =>
					onLyricLineClick(e as LyricLineMouseEvent);
				corePlayerRef.current?.addEventListener("line-click", handler);
				return () =>
					corePlayerRef.current?.removeEventListener("line-click", handler);
			}
		}, [onLyricLineClick]);

		useEffect(() => {
			if (onLyricLineContextMenu) {
				const handler = (e: Event) =>
					onLyricLineContextMenu(e as LyricLineMouseEvent);
				corePlayerRef.current?.addEventListener("line-contextmenu", handler);
				return () =>
					corePlayerRef.current?.removeEventListener(
						"line-contextmenu",
						handler,
					);
			}
		}, [onLyricLineContextMenu]);

		useImperativeHandle(
			ref,
			() => ({
				wrapperEl: wrapperRef.current,
				lyricPlayer: corePlayerRef.current,
			}),
			[wrapperRef.current, corePlayerRef.current],
		);

		return (
			<>
				<div {...props} ref={wrapperRef} />
				{corePlayerRef.current?.getBottomLineElement() && bottomLine
					? createPortal(
							bottomLine,
							corePlayerRef.current?.getBottomLineElement(),
					  )
					: null}
			</>
		);
	},
);
