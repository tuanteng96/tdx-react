import React, { useRef, useState } from 'react'
import {
  useFloating,
  arrow,
  offset,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
  flip
} from '@floating-ui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

function Popover({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef(null)
  const { x, y, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [
      offset(8),
      flip(),
      arrow({
        element: arrowRef
      })
    ],
    whileElementsMounted: autoUpdate
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  return (
    <>
      <button
        type='button'
        className='bg-primary hover:bg-primaryhv text-white mx-[2px] rounded cursor-pointer px-4 py-3 transition text-[14px] flex items-center'
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        Kích hoạt
        <ChevronDownIcon className='w-5 ml-1.5' />
      </button>
      {isOpen && (
        <FloatingPortal>
          <div
            className='fixed'
            style={{
              top: y ?? 0,
              left: x ?? 0,
              zIndex: 1009
            }}
            ref={refs.setFloating}
            {...getFloatingProps()}
          >
            {children({
              onClose: () => setIsOpen(false)
            })}
            <FloatingArrow className='fill-white' ref={arrowRef} context={context} />
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

Popover.propTypes = {}

export default Popover
