import { useState, useEffect, createContext, useContext } from 'react'
import { LayoutSplashScreen } from './EzsSplashScreen'

const AuthContext = createContext()

const useAuth = () => {
  return useContext(AuthContext)
}

if (import.meta.env.DEV) {
  window.top.Info = {
    User: {
      ID: 1,
      FullName: 'Admin System'
    },
    Stocks: [
      {
        Title: 'Quản lý cơ sở',
        ID: 778,
        ParentID: 0
      },
      {
        Title: 'Cser Hà Nội',
        ID: 8975,
        ParentID: 778
      },
      {
        Title: 'Cser Hồ Chí Minh',
        ID: 10053,
        ParentID: 778
      },
      {
        Title: 'Cser Tuyên Quang',
        ID: 11210,
        ParentID: 778
      },
      {
        Title: 'CSER NAM HỘI AN',
        ID: 11226,
        ParentID: 778
      }
    ],
    rightTree: {
      groups: [
        {
          group: 'Cài đặt',
          rights: [
            {
              name: 'config',
              text: 'Thông tin thương hiệu',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'user',
              text: 'Quản lý nhân viên',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'permission',
              text: 'Phân quyền',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'type',
              text: 'Quản lý sản phẩm - dịch vụ',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'promotion',
              text: 'Khuyến mại-Voucher',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            }
          ]
        },
        {
          group: 'Web/app',
          rights: [
            {
              name: 'article',
              text: 'Nội dung / Blogs',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'adv',
              text: 'Media / Video',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'notification',
              text: 'Thông báo web/app',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            }
          ]
        },
        {
          group: 'Phần mềm',
          rights: [
            {
              name: 'quan_ly_khach_hang',
              text: 'Quản lý khách hàng',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'quan_ly_don_hang',
              text: 'Quản lý đơn hàng',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'quan_ly_tien',
              text: 'Quản lý tiền',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'kich_hoat',
              text: 'Kích hoạt',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'duyet_don',
              text: 'Duyệt đơn',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'reset_mat_khau',
              text: 'Reset mật khẩu',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'rut_tien',
              text: 'Rút tiền',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            },
            {
              name: 'duyet_xoa_rut_tien',
              text: 'Duyệt - Xóa Rút tiền',
              hasRight: true,
              stocksList: [
                {
                  ID: 11326,
                  Title: 'Tiêu Dùng Xanh'
                }
              ],
              IsAllStock: true
            }
          ]
        }
      ]
    },
    CrStockID: 8975,
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjU3Mzg1NzkwNTczODU5MjciLCJuYmYiOjE3MDk1MzUzODIsImV4cCI6MTc5NTkzNTM4MiwiaWF0IjoxNzA5NTM1MzgyfQ.MC4OUhfM5A4OF3P_ECnuirBJdxrbutrWZhmBAku2dhg'
  }
}

const getInfoLocalStorage = () => {
  return new Promise(function (resolve) {
    function getInfo() {
      if (window.top.Info) {
        resolve({
          Auth: window.top.Info
        })
      } else {
        setTimeout(() => {
          getInfo()
        }, 50)
      }
    }
    getInfo()
  })
}

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [CrStocks, setCrStocks] = useState(null)
  const [Stocks, setStocks] = useState(null)
  const [RightTree, setRightTree] = useState(null)

  const saveAuth = ({ CrStockID, token, User, rightTree, ...values }) => {
    let newStocks = values.Stocks
      ? values.Stocks.filter((x) => x.ParentID !== 0).map((x) => ({
          ...x,
          label: x.Title,
          value: x.ID
        }))
      : []
    let index = newStocks.findIndex((x) => x.ID === CrStockID)
    setAuth(User)
    setAccessToken(token)
    setStocks(newStocks)
    setRightTree(rightTree)

    if (index > -1) {
      setCrStocks(newStocks[index])
    }
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        accessToken,
        CrStocks,
        Stocks,
        RightTree,
        saveAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit = ({ children }) => {
  const { saveAuth } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    getInfoLocalStorage().then(({ Auth }) => {
      setShowSplashScreen(false)
      saveAuth(Auth)
    })
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
