var covTrees = new Object();

covTrees['bestsnp'] = '((((Reference:2,(TGEN-CoV-AZ-WMTS-TG266871:1,TGEN-CoV-AZ-WMTS-TG268893:2,TGEN-CoV-AZ-WMTS-TG268903:3,TGEN-CoV-AZ-WMTS-TG268913:2,TGEN-CoV-AZ-WMTS-TG271854:0,TGEN-CoV-AZ-WMTS-TG271864:0):3):0.5,TGEN-CoV-AZ-WMTS-TG271862:9.5):0.5,((TGEN-CoV-AZ-WMTS-TG268282:0,TGEN-CoV-AZ-WMTS-TG271575:0):0.5,TGEN-CoV-AZ-WMTS-TG271435:1.5):10.5):1,(TGEN-CoV-AZ-WMTS-TG268188:7.5,((TGEN-CoV-AZ-WMTS-TG268281:0,(TGEN-CoV-AZ-WMTS-TG271868:0,TGEN-CoV-AZ-WMTS-TG268350:1,TGEN-CoV-AZ-WMTS-TG271856:0,TGEN-CoV-AZ-WMTS-TG271866:0):4,TGEN-CoV-AZ-WMTS-TG268657:0,TGEN-CoV-AZ-WMTS-TG269848:1):0.5,(TGEN-CoV-AZ-WMTS-TG269856:0,(TGEN-CoV-AZ-WMTS-TG271882:0,(TGEN-CoV-AZ-WMTS-TG271886:0,TGEN-CoV-AZ-WMTS-TG271890:0):1,TGEN-CoV-AZ-WMTS-TG271888:0,(TGEN-CoV-AZ-WMTS-TG273286:0,TGEN-CoV-AZ-WMTS-TG271894:0,TGEN-CoV-AZ-WMTS-TG271896:0,TGEN-CoV-AZ-WMTS-TG271898:0,TGEN-CoV-AZ-WMTS-TG271900:0,TGEN-CoV-AZ-WMTS-TG273304:1,TGEN-CoV-AZ-WMTS-TG273316:1,TGEN-CoV-AZ-WMTS-TG273318:0):1,TGEN-CoV-AZ-WMTS-TG271922:0):1):1,(TGEN-CoV-AZ-WMTS-TG268770:2,TGEN-CoV-AZ-WMTS-TG268909:2,TGEN-CoV-AZ-WMTS-TG268917:1,(TGEN-CoV-AZ-WMTS-TG273280:0,TGEN-CoV-AZ-WMTS-TG269440:0,TGEN-CoV-AZ-WMTS-TG273282:0):1,(TGEN-CoV-AZ-WMTS-TG269863:0,TGEN-CoV-AZ-WMTS-TG271902:1):1,(TGEN-CoV-AZ-WMTS-TG273294:0,TGEN-CoV-AZ-WMTS-TG273300:0,TGEN-CoV-AZ-WMTS-TG273302:0,TGEN-CoV-AZ-WMTS-TG273308:0,TGEN-CoV-AZ-WMTS-TG273310:4,TGEN-CoV-AZ-WMTS-TG273314:1):3,(TGEN-CoV-AZ-WMTS-TG268002:2.5,TGEN-CoV-AZ-WMTS-TG268360:0.5):1.5,(TGEN-CoV-AZ-WMTS-TG268905:3.5,TGEN-CoV-AZ-WMTS-TG269875:1.5):0.5,TGEN-CoV-AZ-WMTS-TG271878:3,TGEN-CoV-AZ-WMTS-TG268417:2,TGEN-CoV-AZ-WMTS-TG271860:3,((TGEN-CoV-AZ-WMTS-TG268099:0,TGEN-CoV-AZ-WMTS-TG269238:1,TGEN-CoV-AZ-WMTS-TG269358:0):0.5,(TGEN-CoV-AZ-WMTS-TG268183:0,(TGEN-CoV-AZ-WMTS-TG268289:0,TGEN-CoV-AZ-WMTS-TG271578:0):1,(TGEN-CoV-AZ-WMTS-TG269027:0,TGEN-CoV-AZ-WMTS-TG269290:0):1):2,TGEN-CoV-AZ-WMTS-TG268911:1,TGEN-CoV-AZ-WMTS-TG268915:0,(TGEN-CoV-AZ-WMTS-TG269824:1,TGEN-CoV-AZ-WMTS-TG271591:0):1,TGEN-CoV-AZ-WMTS-TG270152:0,TGEN-CoV-AZ-WMTS-TG270200:0,(TGEN-CoV-AZ-WMTS-TG271880:0,TGEN-CoV-AZ-WMTS-TG271884:0):2,TGEN-CoV-AZ-WMTS-TG271892:1,TGEN-CoV-AZ-WMTS-TG272213:0,TGEN-CoV-AZ-WMTS-TG272215:3,(TGEN-CoV-AZ-WMTS-TG271870:0,TGEN-CoV-AZ-WMTS-TG271872:0):1,TGEN-CoV-AZ-WMTS-TG269883:0,TGEN-CoV-AZ-WMTS-TG269439:0,TGEN-CoV-AZ-WMTS-TG268629:1):0.5):1):3.5):1.5):0;'

covTrees['bestsnp-fixed'] = '((((Reference:2,(TGEN-CoV-AZ-WMTS-TG271854:0,TGEN-CoV-AZ-WMTS-TG271864:0,TGEN-CoV-AZ-WMTS-TG266871:1,TGEN-CoV-AZ-WMTS-TG268893:2,TGEN-CoV-AZ-WMTS-TG268913:2,TGEN-CoV-AZ-WMTS-TG268903:3):3):0.5,TGEN-CoV-AZ-WMTS-TG271862:9.5):0.5,((TGEN-CoV-AZ-WMTS-TG268282:0,TGEN-CoV-AZ-WMTS-TG271575:0):0.5,TGEN-CoV-AZ-WMTS-TG271435:1.5):10.5):1,(((TGEN-CoV-AZ-WMTS-TG268281:0,TGEN-CoV-AZ-WMTS-TG268657:0,TGEN-CoV-AZ-WMTS-TG269848:1,(TGEN-CoV-AZ-WMTS-TG271868:0,TGEN-CoV-AZ-WMTS-TG271856:0,TGEN-CoV-AZ-WMTS-TG271866:0,TGEN-CoV-AZ-WMTS-TG268350:1):4):0.5,(TGEN-CoV-AZ-WMTS-TG269856:0,(TGEN-CoV-AZ-WMTS-TG271882:0,TGEN-CoV-AZ-WMTS-TG271888:0,TGEN-CoV-AZ-WMTS-TG271922:0,(TGEN-CoV-AZ-WMTS-TG271886:0,TGEN-CoV-AZ-WMTS-TG271890:0):1,(TGEN-CoV-AZ-WMTS-TG273286:0,TGEN-CoV-AZ-WMTS-TG271894:0,TGEN-CoV-AZ-WMTS-TG271896:0,TGEN-CoV-AZ-WMTS-TG271898:0,TGEN-CoV-AZ-WMTS-TG271900:0,TGEN-CoV-AZ-WMTS-TG273318:0,TGEN-CoV-AZ-WMTS-TG273304:1,TGEN-CoV-AZ-WMTS-TG273316:1):1):1):1,((TGEN-CoV-AZ-WMTS-TG269875:1.5,TGEN-CoV-AZ-WMTS-TG268905:3.5):0.5,(TGEN-CoV-AZ-WMTS-TG268915:0,TGEN-CoV-AZ-WMTS-TG270152:0,TGEN-CoV-AZ-WMTS-TG270200:0,TGEN-CoV-AZ-WMTS-TG272213:0,TGEN-CoV-AZ-WMTS-TG269883:0,TGEN-CoV-AZ-WMTS-TG269439:0,(TGEN-CoV-AZ-WMTS-TG268099:0,TGEN-CoV-AZ-WMTS-TG269358:0,TGEN-CoV-AZ-WMTS-TG269238:1):0.5,TGEN-CoV-AZ-WMTS-TG268911:1,(TGEN-CoV-AZ-WMTS-TG271591:0,TGEN-CoV-AZ-WMTS-TG269824:1):1,TGEN-CoV-AZ-WMTS-TG271892:1,(TGEN-CoV-AZ-WMTS-TG271870:0,TGEN-CoV-AZ-WMTS-TG271872:0):1,TGEN-CoV-AZ-WMTS-TG268629:1,(TGEN-CoV-AZ-WMTS-TG268183:0,(TGEN-CoV-AZ-WMTS-TG268289:0,TGEN-CoV-AZ-WMTS-TG271578:0):1,(TGEN-CoV-AZ-WMTS-TG269027:0,TGEN-CoV-AZ-WMTS-TG269290:0):1):2,(TGEN-CoV-AZ-WMTS-TG271880:0,TGEN-CoV-AZ-WMTS-TG271884:0):2,TGEN-CoV-AZ-WMTS-TG272215:3):0.5,TGEN-CoV-AZ-WMTS-TG268917:1,(TGEN-CoV-AZ-WMTS-TG273280:0,TGEN-CoV-AZ-WMTS-TG269440:0,TGEN-CoV-AZ-WMTS-TG273282:0):1,(TGEN-CoV-AZ-WMTS-TG269863:0,TGEN-CoV-AZ-WMTS-TG271902:1):1,(TGEN-CoV-AZ-WMTS-TG268360:0.5,TGEN-CoV-AZ-WMTS-TG268002:2.5):1.5,TGEN-CoV-AZ-WMTS-TG268770:2,TGEN-CoV-AZ-WMTS-TG268909:2,TGEN-CoV-AZ-WMTS-TG268417:2,(TGEN-CoV-AZ-WMTS-TG273294:0,TGEN-CoV-AZ-WMTS-TG273300:0,TGEN-CoV-AZ-WMTS-TG273302:0,TGEN-CoV-AZ-WMTS-TG273308:0,TGEN-CoV-AZ-WMTS-TG273314:1,TGEN-CoV-AZ-WMTS-TG273310:4):3,TGEN-CoV-AZ-WMTS-TG271878:3,TGEN-CoV-AZ-WMTS-TG271860:3):1):3.5,TGEN-CoV-AZ-WMTS-TG268188:7.5):1.5):0'

covTrees['missingdata'] = '(Reference:2,(TGEN-CoV-AZ-WMTS-TG268188:7.5,((TGEN-CoV-AZ-WMTS-TG268281:0,(TGEN-CoV-AZ-WMTS-TG268350:1,TGEN-CoV-AZ-WMTS-TG271856:0,TGEN-CoV-AZ-WMTS-TG271866:0,TGEN-CoV-AZ-WMTS-TG271868:0):4,TGEN-CoV-AZ-WMTS-TG268657:0,TGEN-CoV-AZ-WMTS-TG269848:1):0.5,(TGEN-CoV-AZ-WMTS-TG269856:0,(TGEN-CoV-AZ-WMTS-TG271882:0,(TGEN-CoV-AZ-WMTS-TG271886:0,TGEN-CoV-AZ-WMTS-TG271890:0):1,TGEN-CoV-AZ-WMTS-TG271888:0,(TGEN-CoV-AZ-WMTS-TG271896:0,TGEN-CoV-AZ-WMTS-TG271894:0,TGEN-CoV-AZ-WMTS-TG271898:0,TGEN-CoV-AZ-WMTS-TG271900:0,TGEN-CoV-AZ-WMTS-TG273286:0,TGEN-CoV-AZ-WMTS-TG273304:1,TGEN-CoV-AZ-WMTS-TG273316:1,TGEN-CoV-AZ-WMTS-TG273318:0):1,TGEN-CoV-AZ-WMTS-TG271922:0):1):1,(TGEN-CoV-AZ-WMTS-TG268360:2,TGEN-CoV-AZ-WMTS-TG268770:2,TGEN-CoV-AZ-WMTS-TG268909:2,TGEN-CoV-AZ-WMTS-TG268917:1,(TGEN-CoV-AZ-WMTS-TG269440:0,TGEN-CoV-AZ-WMTS-TG273280:0,TGEN-CoV-AZ-WMTS-TG273282:0):1,(TGEN-CoV-AZ-WMTS-TG269863:0,TGEN-CoV-AZ-WMTS-TG271902:1):1,(TGEN-CoV-AZ-WMTS-TG273294:0,TGEN-CoV-AZ-WMTS-TG273300:0,TGEN-CoV-AZ-WMTS-TG273302:0,TGEN-CoV-AZ-WMTS-TG273308:0,TGEN-CoV-AZ-WMTS-TG273310:4,TGEN-CoV-AZ-WMTS-TG273314:1):3,(TGEN-CoV-AZ-WMTS-TG268417:2,TGEN-CoV-AZ-WMTS-TG271878:4):0.5,(TGEN-CoV-AZ-WMTS-TG268905:3.5,TGEN-CoV-AZ-WMTS-TG269875:1.5):0.5,((TGEN-CoV-AZ-WMTS-TG268183:0,(TGEN-CoV-AZ-WMTS-TG268289:0,TGEN-CoV-AZ-WMTS-TG271578:0):1,(TGEN-CoV-AZ-WMTS-TG269027:0,TGEN-CoV-AZ-WMTS-TG269290:0):1):2,TGEN-CoV-AZ-WMTS-TG268629:1,TGEN-CoV-AZ-WMTS-TG268915:0,TGEN-CoV-AZ-WMTS-TG269439:0,(TGEN-CoV-AZ-WMTS-TG269824:1,TGEN-CoV-AZ-WMTS-TG271591:0):1,TGEN-CoV-AZ-WMTS-TG269883:0,TGEN-CoV-AZ-WMTS-TG270152:0,TGEN-CoV-AZ-WMTS-TG270200:0,(TGEN-CoV-AZ-WMTS-TG271870:0,TGEN-CoV-AZ-WMTS-TG271872:0):1,(TGEN-CoV-AZ-WMTS-TG271880:0,TGEN-CoV-AZ-WMTS-TG271884:0):2,TGEN-CoV-AZ-WMTS-TG271892:1,TGEN-CoV-AZ-WMTS-TG272213:0,TGEN-CoV-AZ-WMTS-TG272215:3,(((TGEN-CoV-AZ-WMTS-TG269238:2,(TGEN-CoV-AZ-WMTS-TG268002:5.5,TGEN-CoV-AZ-WMTS-TG271860:5.5):1):0.5,TGEN-CoV-AZ-WMTS-TG268911:1.5):1,(TGEN-CoV-AZ-WMTS-TG268099:0,TGEN-CoV-AZ-WMTS-TG269358:0):1):0.5):0.5):1):3.5):2.5,(((TGEN-CoV-AZ-WMTS-TG268903:3,TGEN-CoV-AZ-WMTS-TG266871:1,TGEN-CoV-AZ-WMTS-TG268893:2,TGEN-CoV-AZ-WMTS-TG268913:2):0.5,TGEN-CoV-AZ-WMTS-TG271854:0.5):1.5,(TGEN-CoV-AZ-WMTS-TG271862:10,TGEN-CoV-AZ-WMTS-TG271864:3):2.5):1.5,(TGEN-CoV-AZ-WMTS-TG271435:3.5,(TGEN-CoV-AZ-WMTS-TG268282:0.5,TGEN-CoV-AZ-WMTS-TG271575:0.5):0.5):11.5):0;'

covTrees['missingdata-fixed'] = '((((TGEN-CoV-AZ-WMTS-TG266871:1,TGEN-CoV-AZ-WMTS-TG268893:2,TGEN-CoV-AZ-WMTS-TG268913:2,TGEN-CoV-AZ-WMTS-TG268903:3):0.5,TGEN-CoV-AZ-WMTS-TG271854:0.5):1.5,(TGEN-CoV-AZ-WMTS-TG271864:3,TGEN-CoV-AZ-WMTS-TG271862:10):2.5):1.5,Reference:2,(((TGEN-CoV-AZ-WMTS-TG268281:0,TGEN-CoV-AZ-WMTS-TG268657:0,TGEN-CoV-AZ-WMTS-TG269848:1,(TGEN-CoV-AZ-WMTS-TG271856:0,TGEN-CoV-AZ-WMTS-TG271866:0,TGEN-CoV-AZ-WMTS-TG271868:0,TGEN-CoV-AZ-WMTS-TG268350:1):4):0.5,(TGEN-CoV-AZ-WMTS-TG269856:0,(TGEN-CoV-AZ-WMTS-TG271882:0,TGEN-CoV-AZ-WMTS-TG271888:0,TGEN-CoV-AZ-WMTS-TG271922:0,(TGEN-CoV-AZ-WMTS-TG271886:0,TGEN-CoV-AZ-WMTS-TG271890:0):1,(TGEN-CoV-AZ-WMTS-TG271896:0,TGEN-CoV-AZ-WMTS-TG271894:0,TGEN-CoV-AZ-WMTS-TG271898:0,TGEN-CoV-AZ-WMTS-TG271900:0,TGEN-CoV-AZ-WMTS-TG273286:0,TGEN-CoV-AZ-WMTS-TG273318:0,TGEN-CoV-AZ-WMTS-TG273304:1,TGEN-CoV-AZ-WMTS-TG273316:1):1):1):1,((TGEN-CoV-AZ-WMTS-TG268417:2,TGEN-CoV-AZ-WMTS-TG271878:4):0.5,(TGEN-CoV-AZ-WMTS-TG269875:1.5,TGEN-CoV-AZ-WMTS-TG268905:3.5):0.5,(TGEN-CoV-AZ-WMTS-TG268915:0,TGEN-CoV-AZ-WMTS-TG269439:0,TGEN-CoV-AZ-WMTS-TG269883:0,TGEN-CoV-AZ-WMTS-TG270152:0,TGEN-CoV-AZ-WMTS-TG270200:0,TGEN-CoV-AZ-WMTS-TG272213:0,((((TGEN-CoV-AZ-WMTS-TG268002:5.5,TGEN-CoV-AZ-WMTS-TG271860:5.5):1,TGEN-CoV-AZ-WMTS-TG269238:2):0.5,TGEN-CoV-AZ-WMTS-TG268911:1.5):1,(TGEN-CoV-AZ-WMTS-TG268099:0,TGEN-CoV-AZ-WMTS-TG269358:0):1):0.5,TGEN-CoV-AZ-WMTS-TG268629:1,(TGEN-CoV-AZ-WMTS-TG271591:0,TGEN-CoV-AZ-WMTS-TG269824:1):1,(TGEN-CoV-AZ-WMTS-TG271870:0,TGEN-CoV-AZ-WMTS-TG271872:0):1,TGEN-CoV-AZ-WMTS-TG271892:1,(TGEN-CoV-AZ-WMTS-TG268183:0,(TGEN-CoV-AZ-WMTS-TG268289:0,TGEN-CoV-AZ-WMTS-TG271578:0):1,(TGEN-CoV-AZ-WMTS-TG269027:0,TGEN-CoV-AZ-WMTS-TG269290:0):1):2,(TGEN-CoV-AZ-WMTS-TG271880:0,TGEN-CoV-AZ-WMTS-TG271884:0):2,TGEN-CoV-AZ-WMTS-TG272215:3):0.5,TGEN-CoV-AZ-WMTS-TG268917:1,(TGEN-CoV-AZ-WMTS-TG269440:0,TGEN-CoV-AZ-WMTS-TG273280:0,TGEN-CoV-AZ-WMTS-TG273282:0):1,(TGEN-CoV-AZ-WMTS-TG269863:0,TGEN-CoV-AZ-WMTS-TG271902:1):1,TGEN-CoV-AZ-WMTS-TG268360:2,TGEN-CoV-AZ-WMTS-TG268770:2,TGEN-CoV-AZ-WMTS-TG268909:2,(TGEN-CoV-AZ-WMTS-TG273294:0,TGEN-CoV-AZ-WMTS-TG273300:0,TGEN-CoV-AZ-WMTS-TG273302:0,TGEN-CoV-AZ-WMTS-TG273308:0,TGEN-CoV-AZ-WMTS-TG273314:1,TGEN-CoV-AZ-WMTS-TG273310:4):3):1):3.5,TGEN-CoV-AZ-WMTS-TG268188:7.5):2.5,((TGEN-CoV-AZ-WMTS-TG268282:0.5,TGEN-CoV-AZ-WMTS-TG271575:0.5):0.5,TGEN-CoV-AZ-WMTS-TG271435:3.5):11.5):0'
