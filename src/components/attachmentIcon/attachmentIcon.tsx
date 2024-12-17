import { FileImage, FileText, FileAudio2, FileVideo, File} from 'lucide-react';

type ConditionalIconProps = {
    fileName: string;
};

const ConditionalIcon = ({ fileName }: ConditionalIconProps) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    const renderIcon = () => {
        switch (extension) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <FileImage className='w-10 h-10 m-1 rounded-lg'/>
            case 'pdf':
            case 'txt':
                return <FileText className='w-10 h-10 m-1 rounded-lg'/>
            case 'mp3':
                return <FileAudio2 className='w-10 h-10 m-1 rounded-lg'/>
            case 'mp4':
            case 'mov':
                return <FileVideo className='w-10 h-10 m-1 rounded-lg'/>
            default:
                return <File className='w-10 h-10 m-1 rounded-lg'/>
        }
    };

    return (
        <>
            {renderIcon()}
        </>
    );
};

export default ConditionalIcon;