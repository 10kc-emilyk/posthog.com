import React, { useState, useRef, Fragment, useEffect } from 'react'
import RecordRTC from 'recordrtc'
import { Listbox, Transition } from '@headlessui/react'
// import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
// import { MicrophoneIcon, PauseIcon } from "@heroicons/react/24/outline";
// import { ResumeIcon, TrashIcon } from "@radix-ui/react-icons";
// import { StopIcon } from "@heroicons/react/24/solid";
import StopTime from './StopTime'
import dayjs from 'dayjs'
import Tooltip from './Tooltip'
// import * as EBML from "ts-ebml";
import * as tus from 'tus-js-client'

interface Props {
    open: boolean
    setOpen: (value: boolean) => void
    step: string
    setStep: (value: ((prevState: 'pre' | 'in' | 'post') => 'pre' | 'in' | 'post') | 'pre' | 'in' | 'post') => void
    onSubmit: () => void
}

export default function Recorder({ setOpen, step, setStep, onSubmit }: Props): React.ReactElement {
    const [steam, setStream] = useState<null | MediaStream>(null)
    const [blob, setBlob] = useState<null | Blob>(null)
    const recorderRef = useRef<null | RecordRTC>(null)
    const [pause, setPause] = useState<boolean>(false)
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([])
    const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [duration, setDuration] = useState<number>(0)
    const videoRef = useRef<null | HTMLVideoElement>(null)

    const handleRecording = async () => {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                width: 1920,
                height: 1080,
                frameRate: 30,
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
            },
        })

        let micStream
        try {
            micStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: selectedDevice?.deviceId },
            })
        } catch (error) {
            // Handle the case where microphone permissions are not granted
            console.error('Failed to access microphone:', error)
        }

        const mediaStream = new MediaStream()
        if (micStream) {
            micStream.getAudioTracks().forEach((track) => mediaStream.addTrack(track))
        }
        screenStream.getVideoTracks().forEach((track) => mediaStream.addTrack(track))

        const firstVideoTrack = screenStream.getVideoTracks()[0]
        if (firstVideoTrack) {
            firstVideoTrack.addEventListener('ended', () => handleStop())
        }

        setStream(mediaStream)
        recorderRef.current = new RecordRTC(mediaStream, {
            type: 'video',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mimeType: 'video/webm;codecs="vp9,opus"',
        })
        recorderRef.current.startRecording()

        setStep('in')
    }

    const handleStop = () => {
        if (recorderRef.current === null) return
        recorderRef.current.stopRecording(() => {
            if (recorderRef.current) {
                setBlob(recorderRef.current.getBlob())
                steam?.getTracks().map((track) => track.stop())
            }
        })

        setStep('post')
    }

    const handleDelete = () => {
        if (recorderRef.current === null) return
        setBlob(null)
        recorderRef.current.stopRecording(() => {
            steam?.getTracks().map((track) => track.stop())
        })

        setOpen(false)
        setStep('pre')
    }

    const handlePause = () => {
        if (recorderRef.current) {
            console.log(recorderRef.current?.state)
            if (pause) {
                recorderRef.current?.resumeRecording()
            } else {
                recorderRef.current.pauseRecording()
            }
            setPause(!pause)
        }
    }

    useEffect(() => {
        async function getAudioDevices() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: { echoCancellation: false },
                })
                stream.getTracks().forEach((track) => track.stop()) // release the stream

                const devices = await navigator.mediaDevices.enumerateDevices()
                const audioDevices = devices.filter((device) => device.kind === 'audioinput')
                setAudioDevices(audioDevices)
                if (audioDevices[0]) setSelectedDevice(audioDevices[0])
            } catch (error) {
                console.error(error)
            }
        }

        void getAudioDevices()
    }, [])

    const handleUpload = async () => {
        if (!blob || !videoRef.current) return

        const dateString = 'Recording - ' + dayjs().format('D MMM YYYY') + Math.floor(Math.random() * 90) + 10 + '.webm'
        setSubmitting(true)

        try {
            return new Promise((resolve, reject) => {
                const upload = new tus.Upload(blob.slice(), {
                    endpoint: 'https://lkmbdqgomhvlbqqblkga.supabase.co/storage/v1/upload/resumable',
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    headers: {
                        // Supabase anon key
                        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrbWJkcWdvbWh2bGJxcWJsa2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgyMzM2MTMsImV4cCI6MjAxMzgwOTYxM30.TndT-c0Ae2EyV2Fp0w5nFf2jhOrGXThsMcM9VNi6DWM`,
                    },
                    uploadDataDuringCreation: true,
                    removeFingerprintOnSuccess: false,
                    metadata: {
                        bucketName: 'videos',
                        objectName: dateString,
                        contentType: 'video/webm',
                        cacheControl: '3600',
                    },
                    chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
                    onError: function (error) {
                        console.log('Failed because: ' + error)
                        reject(error)
                    },
                    onProgress: function (bytesUploaded, bytesTotal) {
                        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
                        console.log(bytesUploaded, bytesTotal, percentage + '%')
                    },
                    onSuccess: function () {
                        console.log('Download %s from %s', upload.url)
                        setOpen(false)
                        console.log('successfully uploaded file')
                        onSubmit()
                    },
                })

                // Check if there are any previous uploads to continue.
                return upload.findPreviousUploads().then(function (previousUploads) {
                    // Found previous uploads so we select the first one.
                    if (previousUploads.length) {
                        upload.resumeFromPreviousUpload(previousUploads[0])
                    }

                    // Start the upload
                    upload.start()
                })
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            {step === 'pre' ? (
                <div className="w-full">
                    <Listbox value={selectedDevice} onChange={setSelectedDevice}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative flex w-full cursor-default flex-row items-center justify-start rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 sm:text-sm">
                                {/* <MicrophoneIcon
                                    className="mr-2 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                /> */}
                                <span className="block truncate">
                                    {selectedDevice?.label ?? 'No device selected'}
                                    {selectedDevice?.label === '' ? 'Enabled' : null}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    {/* <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    /> */}
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {audioDevices.map((audioDevice, i) => (
                                        <Listbox.Option
                                            key={i}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 ${
                                                    active ? 'bg-gray-200' : ''
                                                }`
                                            }
                                            value={audioDevice}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                    >
                                                        {audioDevice.label}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                            {/* <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            /> */}
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                    <button
                        type="button"
                        className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400 disabled:cursor-not-allowed"
                        onClick={() => void handleRecording()}
                    >
                        <span>Start recording</span>
                    </button>
                </div>
            ) : null}
            {step === 'in' ? (
                <div className="flex flex-row items-center justify-center">
                    <Tooltip title="Finish recording">
                        <div
                            onClick={handleStop}
                            className="flex cursor-pointer flex-row items-center justify-center rounded pr-2 text-lg hover:bg-gray-200"
                        >
                            {/* <StopIcon className="h-8 w-8 text-[#ff623f]" aria-hidden="true" /> */}
                            <StopTime running={!pause} duration={duration} setDuration={setDuration} />
                        </div>
                    </Tooltip>
                    <div className="mx-2 h-6 w-px bg-[#E7E9EB]"></div>
                    <Tooltip title={pause ? 'Resume' : 'Pause'}>
                        <div onClick={handlePause} className="cursor-pointer rounded p-1 hover:bg-gray-200">
                            {pause ? (
                                <span>test</span>
                            ) : (
                                // <ResumeIcon
                                //     className="h-6 w-6 text-gray-400"
                                //     aria-hidden="true"
                                // />
                                <span>test</span>
                                // <PauseIcon
                                //     className="h-6 w-6 text-gray-400"
                                //     aria-hidden="true"
                                // />
                            )}
                        </div>
                    </Tooltip>
                    <Tooltip title="Cancel recording">
                        <div onClick={handleDelete} className="ml-1 cursor-pointer rounded p-1 hover:bg-gray-200">
                            {/* <TrashIcon className="h-6 w-6 text-gray-400" aria-hidden="true" /> */}
                        </div>
                    </Tooltip>
                </div>
            ) : null}
            {step === 'post' ? (
                <div>
                    {blob ? (
                        <video
                            src={URL.createObjectURL(blob)}
                            controls
                            ref={videoRef}
                            className="mb-4 max-h-[75vh] w-[75vw]"
                        />
                    ) : null}
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:bg-indigo-400 disabled:cursor-not-allowed"
                            disabled={submitting}
                            onClick={() => void handleUpload()}
                        >
                            {submitting ? (
                                <>
                                    <svg
                                        className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                <>Save to cloud</>
                            )}
                        </button>
                        <button
                            type="button"
                            className="ml-auto inline-flex items-center rounded-md bg-[#dc2625] px-4 py-2 text-sm font-semibold leading-6 text-white shadow transition duration-150 ease-in-out hover:opacity-80 disabled:cursor-not-allowed"
                            onClick={() => {
                                void handleDelete()
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
