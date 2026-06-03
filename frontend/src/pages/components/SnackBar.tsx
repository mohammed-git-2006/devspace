

interface SnackBarInterface
{
  msg: string;
  type: 'success'|'warning'|'error'
}

export default function SnackBar({msg} : SnackBarInterface)
{


  return <div className="w-1/2 absolute bottom-10 left-0 right-0 bg-black/50 p-3
  rounded-lg border-1 border-white/20 backdrop-blur-sm">
    {msg}
  </div>
}